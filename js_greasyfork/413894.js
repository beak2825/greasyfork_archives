// ==UserScript==
// @name         蓝墨云班课一键起飞
// @namespace    http://blog.dsb.ink/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @match        https://www.mosoteach.cn/web/index.php?c=res*
// @downloadURL https://update.greasyfork.org/scripts/413894/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E8%B5%B7%E9%A3%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/413894/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E8%B5%B7%E9%A3%9E.meta.js
// ==/UserScript==

(function() {
    const div = document.getElementsByClassName("hide-div");
    const box = document.querySelectorAll(".res-row-box .res-row-title");

    const 提示 = document.createElement("div")
    提示.innerHTML = "点击下方按钮开始芜湖"
    提示.style = `	line-height: 50px;
					text-align: center;
					position: fixed;
					top: 0px;
					left: 50%;
					background: rgb(9, 192, 218);
					color: rgb(255, 255, 255);
					font-size: 16px;
					display: inline-block;
					padding: 0 10px;
					transform: translateX(-50%);`
    document.body.appendChild(提示)

    function 休个息(min, max) {
        min *= 1000;
        max *= 1000;
        const time = !min ? max : Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function 开始升天(i){
        const block = div[i].children;
        const stop = async num => {
			if(num === block.length - 1){
				await 休个息(10,20)
				提示.innerText = "芜湖完毕"
			}
        }
        for(let j = 0; j < block.length; j++){
            const fileId = block[j].getAttribute("data-value")
            $.ajax({
                type:"POST",
                url:"https://www.mosoteach.cn/web/index.php?c=res&m=request_url_for_json",
                data:{
                    'file_id' : fileId,
                    'type': 'VIEW',
                    'clazz_course_id': clazzcourseId
                },
                dataType:"json",
                success: function(msg){
                    const src = msg.src
                    if(src.indexOf("m3u8") > -1){
                        fetch(src)
                            .then(data=>data.text())
                            .then(text=>{
                            let time = 0
                            for(i of text.split("\n")){
                                if(i.indexOf("#EXTINF:") > -1){
                                    i = parseFloat(i.replace("#EXTINF:",""))
                                    time += i
                                }
                            }
                            time = Math.ceil(time)
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to',
                                data: {
                                    clazz_course_id: clazzcourseId,
                                    res_id: fileId,
                                    watch_to: time,
                                    duration: time,
                                    current_watch_to: time
                                },
                                success: function(){
									stop(j)
                                }
                            });
                        }
                                 )
                    }else{
                        fetch(block[j].getAttribute("data-href")).then(res=>{
							stop(j)
                        })
                    }
                }
            })
        }
    }


    for(let i = 0; i < box.length; i++){
        const span = document.createElement("span")
        span.innerHTML = "本章起飞"
        span.style = `	width: 100px;
						height: 100%;
						display: inline-block;
						background: #09C0DA;
						text-align: center;
						float: right;
						margin-right: 20px;
						color: #fff`
        box[i].appendChild(span)
        span.addEventListener("click", ()=>{
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            提示.innerText = "开始芜湖......"
            开始升天(i)
        })
    }
})();