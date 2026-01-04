// ==UserScript==
// @name         策略中心 - 画像爬取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简化从策略中心中获取画像的工具
// @author       You
// @include      *://strategy.tmall.com/*
// @icon         https://img.alicdn.com/tfs/TB1_5kWnKuSBuNjy1XcXXcYjFXa-32-32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432485/%E7%AD%96%E7%95%A5%E4%B8%AD%E5%BF%83%20-%20%E7%94%BB%E5%83%8F%E7%88%AC%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432485/%E7%AD%96%E7%95%A5%E4%B8%AD%E5%BF%83%20-%20%E7%94%BB%E5%83%8F%E7%88%AC%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!/CustomCrowdPerspective/.test(location.hash)) return;
    var tagDict = {};
    var interval = setInterval(function () {
        if (document.querySelector("#content_container > div > div.think-layout > div.content > div > div.customCrowd-perspective-Top")) {
            addElement();
            clearInterval(interval);
        }
        return;
    }, 500);

    function addElement() {
        // 插入弹窗
        var url = 'https://strategy.tmall.com/api/scapi?path=/v1/tag/list/all';
        fetch(url)
            .then(res => res.json())
            .then(function(out){
            // 向网页添加需要的 CSS样式
            var style = document.createElement("style");
            var head = document.getElementsByTagName("head")[0];

            style.type = "text/css";
            var text = document.createTextNode(`
    /* 弹窗 (background) */
	.modal-jup {
		display: none; /* 默认隐藏 */
		position: fixed;
		z-index: 9999999;
		padding-top: 50px;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgb(0,0,0);
		background-color: rgba(0,0,0,0.4);
	}

	/* 弹窗内容 */
	.modal-content-jup {
		position: relative;
		background-color: #fefefe;
		margin: auto;
		padding: 0;
		border: 1px solid #888;
		width: 80%;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
		-webkit-animation-name: animatetop;
		-webkit-animation-duration: 0.4s;
		animation-name: animatetop;
		animation-duration: 0.4s
	}

	/* 添加动画 */
	@-webkit-keyframes animatetop {
		from {top:-300px; opacity:0}
		to {top:0; opacity:1}
	}

	@keyframes animatetop {
		from {top:-300px; opacity:0}
		to {top:0; opacity:1}
	}

	/* 关闭按钮 */
	.modal-close-jup {
		float: right;
		font-size: 20px;
		font-weight: bold;
        margin: 5px;
	}

	.modal-close-jup:hover,
	.modal-close-jup:focus {
		color: #000;
		text-decoration: none;
		cursor: pointer;
	}

	.modal-header-jup {
		padding: 2px 16px;
		background-color: #ededed;
	}

	.modal-body-jup {
		padding: 2px 16px;
        height: 500px;
		overflow-y: scroll;
        font-size: medium;
    }

	.modal-footer-jup {
		padding: 2px 16px;
        text-align: right;
	}





    .button-total-jup {
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        text-align: center;
        font-size: 16px;
        margin: 4px 2px;
        padding: 5px 10px;
        cursor: pointer;
    }

    .button-jup {
        margin: 5px 0 5px 30px;
        background-color: #4CAF50;
        border: 1px solid #4CAF50;
        color: white;
    }

    .button-jup:hover {
        background-color: white;
        color: black;
        border: 1px solid #4CAF50;
    }

    fieldset div {
        width: 10em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        float: left;
        margin: 15px;
    }
`);
            style.appendChild(text);
            head.appendChild(style);

            // 向网页插入按钮
            var button = `
<!-- 画像抓取按钮 -->
<button class='button-total-jup button-jup' id='open-jup'>画像爬取</button>
`;
            var header = document.querySelector("#content_container > div > div.think-layout > div.content > div > div.customCrowd-perspective-Top");
            header.innerHTML += button;

            var tagDiv = '';
            // 每个标签
            out.data.forEach(function(e){
                var curDiv = '';
                // 每个checkbox
                e.tagPropList.forEach(function(x){
                    curDiv += `<div><label for="${x.tagId}-jup"><input type="checkbox" id="${x.tagId}-jup" name='${e.tagCateName}' value='${x.tagId}'>${x.tagTitle}</label></div>`;
                    tagDict[x.tagId] = x.tagTitle;
                });

                tagDiv += `<fieldset style='margin: 20px 0'><legend>${e.tagCateName}</legend>${curDiv}</fieldset>`;
            })
            var modal = `
<!-- 弹窗 -->
<div id="modal-jup" class="modal-jup">
    <!-- 弹窗内容 -->
	<div class="modal-content-jup">
	  <div class="modal-header-jup">
	    <span class="modal-close-jup">&times;</span>
	    <h2 style="margin: 5px">选择标签</h2>
	  </div>
	  <div class="modal-body-jup">
          <textarea style="width: 100%; color:gray" rows="3" id="tag-list-text"></textarea>
          <div>
              ${tagDiv}
          </div>
	  </div>
	  <div class="modal-footer-jup">
	    <button class='button-total-jup button-jup'>开始爬取</button>
	  </div>
	</div>

</div>
`;
            header.innerHTML += modal;
            addUiLogic();
        });
    };


    function addUiLogic() {
        // UI逻辑
        var openBtn = document.getElementById('open-jup');
        var closeSpan = document.querySelector('.modal-close-jup');
        var getDataBtn = document.querySelector("#modal-jup > div > div.modal-footer-jup > button");
        openBtn.onclick = function() {
            document.getElementById('modal-jup').style.display = "block";
        };
        closeSpan.onclick = function() {
            document.getElementById('modal-jup').style.display = "none";
        };

        var che_list = document.querySelectorAll("#modal-jup input[type=checkbox]");
        for(var i=0; i < che_list.length; i++){
            che_list[i].onclick = function (event) {
                event.stopPropagation();
                handleCheck(this);
            }
        }

        getDataBtn.onclick = getData;
    };

    var tagSet = new Set();
    function handleCheck(c) {
        // 选中
        if (c.checked) {tagSet.add(c.value);}
        else {tagSet.delete(c.value);}

        document.getElementById('tag-list-text').value = Array.from(tagSet).join('\t');
    }

    function getData() {
        var ws = new WebSocket("wss://ws-insight-engine.tmall.com/");

        ws.onmessage = function(evt){
            var s = '';
            console.log('服务端信息:', evt.data)
            var j = JSON.parse(evt.data);
            var result = j.body.results[0].results;
            console.log(result);

            Object.keys(result).forEach(function (key){
                s += `${tagDict[key]}\n`;
                var d = result[key]
                d.perspectiveItems.forEach(function (each){
                    s += `${each.tagValueName}\t${each.rate / 100}\n`;
                })
            })
            console.log(s);
            navigator.clipboard.writeText(s);
            alert('复制完成');
        };
        ws.onopen = function () {
            var data = {
                method: "/iSheetCrowdService/offline",
                headers: {
                    rid: "163107008328603",
                    type: "PULL"
                },
                body:{
                    args:{
                        id: "661",
                        perspectTaskId: location.href.match(/([^\/]*)\/*$/)[1],
                        bizParam: {
                            crowdIds: [
                                location.href.match(/([^\/]*)\/*$/)[1]
                            ],
                            tagList: document.querySelector("#tag-list-text").value.split('\t')
                        },
                        appId: "209"
                    }
                }
            }
            data = JSON.stringify(data);
            console.log(data);
            ws.send(data);
        };
    }

})();