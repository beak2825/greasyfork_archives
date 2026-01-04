// ==UserScript==
// @name         云班课🆕答题小能手🥇【开源版】
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  【😎蓝墨云全自动答题，一键完成所有资源学习😎】、【🧡功能全部免费使用🧡】【🔥抵制网络答题考核制度⚡️，🌵学生的平时成绩不应由简单的题目判定🌵，更不是依靠搜索引擎🔥】，【欢迎加入qq群:😄947446522😄，共同交流进步】。【💚作者在此保证，脚本无任何诸如（手机号，学校信息，等隐私信息收集）💚】
// @author       阿绿
// @note         致谢表：@Pumpkin、@小陈陈陈陈啊、@Sli、@无心人、@29827*0049、@热心解答（以上均是对此脚本做出过有效BUG提交OR提供账户帮助修复OR提供好的idea，如有遗漏请告知）
// @supportURL   https://greasyfork.org/scripts/462689-%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B/code/%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @homepageURL  https://greasyfork.org/scripts/462689-%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B/code/%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @match        https://www.mosoteach.cn/web/index.php?*
// @icon         https://bkimg.cdn.bcebos.com/pic/4ec2d5628535e5dde7114110e88eb0efce1b9c16c4e1
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://greasyfork.org/scripts/463249-%E4%BA%91%E7%8F%AD%E7%8F%AD%E4%BE%9D%E8%B5%96/code/%E4%BA%91%E7%8F%AD%E7%8F%AD%E4%BE%9D%E8%B5%96.js?version=1170857
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      121.37.103.75
// @connect      gitee.com
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464171/%E4%BA%91%E7%8F%AD%E8%AF%BE%F0%9F%86%95%E7%AD%94%E9%A2%98%E5%B0%8F%E8%83%BD%E6%89%8B%F0%9F%A5%87%E3%80%90%E5%BC%80%E6%BA%90%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464171/%E4%BA%91%E7%8F%AD%E8%AF%BE%F0%9F%86%95%E7%AD%94%E9%A2%98%E5%B0%8F%E8%83%BD%E6%89%8B%F0%9F%A5%87%E3%80%90%E5%BC%80%E6%BA%90%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

;(function(_this) {
    function MyPage(menu){
        // time = Math.floor(Date.now()/10000);
        // time = time %16;
        // console.log(time)
        // // this.axios = _this.axios;
        // // this.Qs =Qs;
        this.$ = $;
        this.json = _this.JSON
        this.namespace = menu.id;
        this.menu = menu;
        this.config = {};
        this.config.tk_uid =null;
        this.initMenu();
        // this.initVue();
        return this;
    }
    MyPage.prototype.urlToObject = function(url){
        let obj = {}
        let arr1 = url.split("?")
        let arr2 = arr1[1].split("&")
        for(let i=0;i<arr2.length;i++){
            let res = arr2[i].split("=")
            obj[res[0]]=res[1]
        }
        return obj;
    }

    // MyPage.prototype.guid= function(data){
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //         var r =Math.random() * 16 | 0,
    //             v = c == 'x' ? r : (r & 0x3 | 0x8);
    //             console.log(v);
    //         return v.toString(16);
    //     });
    // }
    MyPage.prototype.upladApi = function(url,data){
        var obj={};
        obj.poolId = this.config.poolId;
        obj.token = "06e599f3-78db-4c71-b4fa-2b496beab1f6";
        for(var key in data){
            obj[key] = data[key];
        }
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                timeout: 10000,
                method: "post",
                "url": url,
                headers:{
                    "Content-Type":'application/json',
                    accept: "application/json",
                },
                data: JSON.stringify(obj),
                onload: function(response) {
					var status = response.status;
					var playurl = "";
                    var responseText = response.responseText;
					if(status==200||status=='200'||status==501||status=='501'||status==400||status=='400'){
						resolve({"result":"success", "json":responseText});
					}else{
                        //resolve({"result":"success", "json":responseText});
						reject({"result":"error", "json":responseText});
				    }
                },
                onerror : function(err){
                    console.log('error')
                    console.log(err)
                },
                ontimeout : function(inf){
                    if(url != "http://121.37.103.75:10086/tiku/api/v1/problems"){
                        console.log('请求超时')
                        console.log(inf)
                        let aner = $('body').find("#aner")
                        aner.css("display","block")
                        aner.text("服务器响应超时，请稍后重试，或者直接加群，来催更。");
                    } 
                }
            });
        });
    }
    
    MyPage.prototype.HtmlUtil = {
        /*1.用浏览器内部转换器实现html转码*/
        htmlEncode:function (html){
            //1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement ("div");
            //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
            (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
            //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
            var output = temp.innerHTML;
            temp = null;
            return output;
        },
        /*2.用浏览器内部转换器实现html解码*/
        htmlDecode:function (text){
            //1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement("div");
            //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
            temp.innerHTML = text;
            //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
    };

    MyPage.prototype.resoluAnswers=function(data){
        let newData = {};
        if(data ==null){
            return console.log("并未获取到题库数据");
        }
        if("activity" in data){
            console.log("蓝墨云题库重组中");
            newData.id = data.activity.id;
            newData.title = data.activity.title;
            newData.rows = [];
            data.activity.topics.forEach(row=>{
                let _data = {};
                _data.id = row.topic_id;
                row.subject=this.HtmlUtil.htmlDecode(row.subject);
                _data.subject = row.subject;
                _data.options = [];
                _data.answers = [];
                _data.type = row.type;
                if(row.type == "TF"){
                    if(row.tf_answer!=null){
                        _data.answers.push(row.tf_answer);
                    }else{
                        if(row.result == 1){
                            _data.answers.push(row.user_tf_answer)
                        }else{
                            _data=null;
                        }
                    }
                }else if(row.type == "FILL"){
                    row.fill.blank_alternatives.forEach(answer=>{
                        if(answer.contents[0] !=null){
                            _data.answers.push(answer.contents);
                        }else{
                            if(answer.result ==1){
                                _data.answers.push(answer.user_content)
                            }else{
                                _data=null;
                            }
                        }
                    });
                }else{
                    if(row.answers.length != 0){
                        row.answers.forEach(index =>{
                            row.options.forEach(option=>{
                                _data.options.push(this.HtmlUtil.htmlDecode(option.content));
                                if(option.item_no == index){
                                    _data.answers.push(this.HtmlUtil.htmlDecode(option.content));
                                }
                            });
                        });
                    }else{
                        if(row.result == 1){
                            row.user_answers.forEach(index =>{
                                row.options.forEach(option=>{
                                    _data.options.push(this.HtmlUtil.htmlDecode(option.content));
                                    if(option.item_no == index){
                                        _data.answers.push(this.HtmlUtil.htmlDecode(option.content));
                                    }
                                });
                            });
                        }else{
                            _data=null;
                        }
                    }
                    
                }
                if(_data != null){
                    newData.rows.push(_data);
                }
                
            });
        }else if("paperId" in data){
            console.log("meto题库重组中");
            newData.id = data.title;
            newData.rows = [];
            data.problems.forEach(row=>{
                let _data ={};
                _data.subject = row.text;
                _data.answers = JSON.parse(row.answer);
                newData.rows.push(_data);
            });
            
        }else if("rule" in data){
            console.log("助手题库重组中");
            newData.rows = [];
            if("get_answer" in data){ //修改未测试
                data.get_answer.forEach(row=>{
                    let _data ={};
                    _data.answers = [];
                    let br = new RegExp("-and-","g");
                    row.t = row.t.replace(br,"&");
                    row.t=this.HtmlUtil.htmlDecode(row.t);
                    _data.subject = row.t;
                    row.a.forEach(an=>{
                        _data.answers.push(this.HtmlUtil.htmlDecode(an.replace(br,"&")))
                    })
                    _data.type =row.y;
                    _data.options = row.s;
                    newData.rows.push(_data);
                });
            }
        }else if("flag" in data){
            if (data.flag == "metoproblems"){
                console.log("meto1题组重组中");
                newData.id = data.title;
                newData.rows = [];
                try{
                    data.problems.forEach(row=>{
                        let _data ={};
                        _data.subject = row.text;
                        _data.answers = JSON.parse(row.answer);
                        newData.rows.push(_data);
                    });
                }catch (e){
                    // alert("服务器连接失败，请联系作者。")
                    console.log("发生异常:" + e);
                }
                
            }
            
        }else{
            console.log("题库格式未识别");
            console.log(data);
        }
        console.log(newData)
        return newData;
    }
/*
*  云班课请求
*/

    MyPage.prototype.getListMember = function(clazzcourseId){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=member&m=get_list_member",
                dataType:"json",
                data: {
                    clazz_course_id: clazzcourseId,
                    order_item: 'score'
                },
                success: function(res) {
                    resolve(res.data.member_data);
                }
            });
        });
    }
    MyPage.prototype.personResult = function(id,userId,ccId){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_result",
                dataType:"json",
                data: {
                    id: id,
                    user_id: userId,
                    cc_id: ccId,
                },
                success: function(res) {
                    resolve(res);
                }
            });
        });
    }
    
    MyPage.prototype.join_class=function(){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=clazzcourse&m=my_joined",
                dataType:"json",
                success: function(res) {
                    resolve(res.data);
                }
            });
        });
    }

    MyPage.prototype.get_page=function(class_id){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=interaction&m=index&clazz_course_id="+class_id,
                success: function(res) {
                    resolve(res);
                }
            });
        });
    }

    MyPage.prototype.get_page_status=function(id,ccId){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=get_quiz_ranking",
                dataType:"json",
                data: {
                    id: id,
                    ccId: ccId,
                },
                success: function(res) {
                    resolve(res);
                }
            });
        });
    }

    MyPage.prototype.x_res  = function(reslist){
        
        var watch = reslist[0]
        var req = {}
        if (reslist.length != 0) {
            $("#x_res").text("剩下" + reslist.length + "个")
        } else {
            $("#x_res").text("全部完成")
            location.reload()
            return 0
        }
        var clazz_course_id = this.config.clazz_course_id
        $.ajax({
            type: "POST",
            url: "https://www.mosoteach.cn/web/index.php?c=res&m=request_url_for_json",
            data: {
                'file_id': watch.id,
                'type': 'VIEW',
                'clazz_course_id': clazz_course_id,
            },
            dataType: "json",
            success: msg => {
                const src = msg.src
                if (src.indexOf("m3u8") > -1) {
                    fetch(src)
                        .then(data => data.text())
                        .then(text => {
                            let time = 0
                            for (i of text.split("\n")) {
                                if (i.indexOf("#EXTINF:") > -1) {
                                    i = parseFloat(i.replace("#EXTINF:", ""))
                                    time += i
                                }
                            }
                            time = Math.ceil(time)
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to',
                                data: {
                                    clazz_course_id: clazz_course_id,
                                    res_id: watch.id,
                                    watch_to: time,
                                    duration: time,
                                    current_watch_to: time
                                },
                                success: res => {
                                    reslist.splice(0, 1)
                                    this.x_res(reslist)
                                }
                            });
                        })
                } else {
                    reslist.splice(0, 1)
                    this.x_res(reslist)
                }
            }
        })
    }

    MyPage.prototype.getAnswers = async function(id,deep){
        let answers = {};
        let obj={
            "poolId": this.config.poolId,
            "token": "06e599f3-78db-4c71-b4fa-2b496beab1f6",
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "==",
                "argument1": "papertitle",
                "argument2": id,
            },
            "deep": deep,
        };
        await(this.upladApi("http://121.37.103.75:10086/tiku/api/v1/queryCollection",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = JSON.parse(resutData.json).results;
                console.log("总共查询到数据库数量"+data.length+"个");
                data.forEach((item, index) =>{
                    if(index == 0){
                        answers =this.resoluAnswers(item);
                    }else{
                        this.resoluAnswers(item).rows.forEach(i =>{
                            answers.rows.push(i);
                        })
                        
                    }
                });
                // if(this.config.answers == null ||this.config.answers.rows == false){
                //     console.log("尝试查询题库2");
                //     let obj={
                //         "action": "get_answer",
                //         "url": "https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=reply&id="+this.config.id,
                //         "question": [],
                //         "userId": "rand",
                //         "exam": {
                //                 "limit": false,
                //                 "see_answer": true
                //         },
                //         "LiuLiuDaShun1234": true
                //     };
                //     await(this.upladApi("https://eb28743a-0a36-4e14-a166-160855f57610.bspapp.com/http/search",obj).then((resutData)=>{
                //         if(resutData.result==="success" && !!resutData.json){
                //             var data = JSON.parse(resutData.json).result;
                //             this.config.answers = this.resoluAnswers(data);

                //             if( !("answers" in this.config)||this.config.answers.rows == false){
                //                 console.log("未查询到数据");
                //                 return null;
                //             }
                //             let obj={
                //                 "poolId": this.config.poolId,
                //                 "token": "06e599f3-78db-4c71-b4fa-2b496beab1f6",
                //                 "userId":   this.config.tk_uid,
                //                 "tags":["网络"],
                //                 //"tags":[this.config.answers.title,"云班课"],
                //                 "title":this.config.id,
                //                 "problems":[],
                //             };
                //             data={};
                //             this.config.answers.rows.forEach(row=>{
                //                 data={
                //                     "tags":     ["网络"],
                //                     "text":     row.subject,
                //                     "answer":   JSON.stringify(row.answers),
                //                 };
                //                 data.tags.push(row.type);
                //                 let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                //                 let i=0;
                //                 row.options.forEach(option =>{
                //                     data[l[i]]=option;
                //                     i=i+1;
                //                 })
                //                 obj.problems.push(data);
                //             });
                //             this.upladApi("http://121.37.103.75:10086/tiku/api/v1/problems",obj).then((resutData)=>{
                //                 if(resutData.result==="success" && !!resutData.json){
                //                     var data = JSON.parse(resutData.json).data;
                //                     console.log(data);
                //                 }
                //             });
                //         }
                //     }));
                // }
            }
        }));

        return answers;
    }
    MyPage.prototype.getCookie = function(objName) {   //获取指定名称的cookie的值
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
          var temp = arrStr[i].split("=");
          if (temp[0] == objName) return temp[1];  //解码
        }
        return "";
    }

    MyPage.prototype.arrowMove = function(e){
        // 元素大小
        let elW = e.currentTarget.offsetWidth
        let elH = e.currentTarget.offsetHeight
        // 元素位置
        let elL = e.currentTarget.offsetLeft
        let elT = e.currentTarget.offsetTop
        // 鼠标位置
        let x = e.clientX
        let y = e.clientY
        // 窗口大小
        let w = window.innerWidth
        let h = window.innerHeight
        // 鼠标到元素左边距离
        let moveX = x - elL
        let moveY = y - elT
        let el = e.currentTarget
        document.onmousemove = function (e) {
            el.style.position = 'fixed';
            el.style.left = e.clientX -moveX + 'px'
            el.style.top =e.clientY - moveY + 'px'
        }
        document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
        }
    };

    MyPage.prototype.initMenu = function(){
        let $ = this.$,menu = this.menu;
        $(document).on('mousedown','#aner', function (e) {
            window.my.arrowMove(e);
        });
        $(document).on('click', '#x_start', function () {
            window.my.start();
        });
        $(document).on('click', '#x_set', function () {
            $('body').find("#set").toggle('active');
        });
        $(document).on('click', '#x_find',async function () {
            let aner = $('body').find("#aner")
            let text = document.getElementById("find_input")
            aner.css("display","block")
            aner.text("");
            
            if(text.value.length <10){
                aner.append("搜索题目需要10个字符以上");
                return;
            }
            aner.append("若长时间未返回信息，请反馈<hr>");
            // problem = window.my.HtmlUtil.htmlDecode(text.value);
            // console.log(problem)
            await window.my.findproblem(text.value.replace(/   /g,"   "))
            aner.text("");
            aner.append("搜索到"+window.my.config.answer.rows.length+"条相关题目<hr>");
            window.my.config.answer.rows.forEach(row=>{
                aner.append("题目:"+row.subject+"<br>"+"答案:");
                row.answers.forEach(answer =>{        
                     aner.append(answer+" ");
                });
                aner.append("<hr>");
            });
        });
        
        $(document).on('click', '#x_yue', async function () {
            let aner = $('body').find("#aner")
            aner.css("display","block")
            $("#x_yue").attr("disabled", true)
            aner.text("正在搜索答案中");
            let answers = await(window.my.getAnswers(window.my.config.id,true));
            if(!answers||JSON.stringify(answers) == "{}"){
                aner.text("暂时未收录此题，若可直接查看答案，进入查看题目答案页面，将自动收录答案信息");
                return;
            }
            aner.text("");
            answers.rows.forEach(row=>{
                aner.append("题目:"+row.subject+"<br>"+"答案:");
                row.answers.forEach(answer =>{        
                     aner.append(answer+" ");
                });
                aner.append("<hr>");
            });
                
        });
        $(document).on('click', '#x_res', async function () {
            $("#x_res").attr("disabled", true)
            var reslist = []
            $(".res-row-open-enable").each(function() {
                if ($(this).find('span[data-is-drag]')[0].dataset.isDrag == "N") {
                    reslist.push({
                        id: $(this).attr('data-value'),
                        state: $(this).find('span[data-is-drag]')[0].dataset.isDrag,
                        type: $(this).attr('data-mime')
                    })
                }
            });
            window.my.x_res(reslist)
        });
        
            /**
     * MosoteachHelper CSS
     */
    const styleTag = `
    <style>
        #${menu.id} #zhu button{
            width: 130px;
            height: 40px;
            background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%); /* W3C */
            border: none;
            border-radius: 5px;
            position: relative;
            border-bottom: 4px solid #2b8bc6;
            color: #fbfbfb;
            font-weight: 600;
            font-family: 'Open Sans', sans-serif;
            text-shadow: 1px 1px 1px rgba(0,0,0,.4);
            font-size: 15px;
            text-align: left;
            text-indent: 5px;
            box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);
            cursor: pointer;
          
          /* Just for presentation */  
            display: block;
            //margin: 0 0 0 12px;
        }
        #${menu.id} #zhu button:active {
            box-shadow: 0px 2px 0px 0px rgba(0,0,0,.2);
            top: 1px;
          }
          
        #${menu.id} #zhu button:after {
            content: "";
            width: 0;
            height: 0;
            display: block;
            border-top: 20px solid #187dbc;
            border-bottom: 20px solid #187dbc;
            border-left: 16px solid transparent;
            border-right: 20px solid #187dbc;
            position: absolute;
            opacity: 0.6; 
            right: 0;
            top: 0;
            border-radius: 0 5px 5px 0;  
          }
        #${menu.id}{
            text-align:center;
            width:0;
            height:0;
            position:fixed;
            left:${menu.pos.x}px;
            top:${menu.pos.y}px;
            background:${menu.background};
            opacity:${menu.opacity};
        }
        #${menu.id} .drawer{
            max-height:200px;
            overflow:auto;
            text-align:left;
            display: none;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            width: 240px; /* initially */
            opacity: 0.9;
            z-index: 199;
            padding:3px;
            margin:10px;
        }
        #${menu.id} .drawer p{
            text-align:left;
            padding-left:5px;
        }
        #${menu.id} .drawer p button{

        }
    </style>`;
        $(styleTag).appendTo('head');
        let $menu = $(
            `<div id='${menu.id}'>
                <div id="zhu">
                    <button id="x_set">设置界面</button>
                </div>
                <div class= "drawer" id="set">
                    <p>
                        用户<input id = "tiku_user" readonly="readonly" value="未获取到用户名,请刷新重试" />
                    </p>
                    <p>
                        题目<input id = "find_input" placeholder="搜索题目需要10个字符以上" />&nbsp<button  id="x_find" >搜索</button>
                    </p>
                    <p>
                        如遇到答案未显示,未加载,未标红,等等问题,请加qq群:286997695反馈
                    </p>
                </div>
                <div class= "drawer" id="aner">
                    <p>
                        正在获取试卷中，请稍等
                    </p>
                
                </div>
            </div>`);
        $('body').append($menu);
    }
   

    MyPage.prototype.initData = async function(){ //初始化
        
        this.config = this.urlToObject(window.location.href);
        this.config.tk_uid=GM_getValue("ti_uid");
        this.config.pp = GM_getValue("pp");
        this.config.poolId = GM_getValue("poolId");
        if(!this.config.tk_uid || !this.config.pp || !this.config.poolId){
            let classListData = await (this.join_class());
            if(classListData.length == 0){
                return console.log("未登录账户");
            }
            GM_setValue("ccid",classListData[0].id);
            let {data:objectList} = await (this.getListMember(classListData[0].id));
            if(objectList.length <= 0 ){
                return alert("初始化脚本失败");
            }
            this.config.user_id = objectList[0].user_id;
            this.config.user_list = objectList;
            // console.log(this.config.user_list)
            this.config.full_name = objectList[0].full_name;
            this.config.clazz_course_id = classListData[0].id
            let obj={
                "unionid": objectList[0].user_id,
                "username": objectList[0].full_name,
                "grade": "云班课",
            };
            await(this.upladApi("http://121.37.103.75:10086/tiku/api/v1/userInfo",obj).then((resutData)=>{
                if(resutData.result==="success" && !!resutData.json){
                    var data = JSON.parse(resutData.json).data;
                    if(data != null){
                        if("message" in data){
                            data.message = data.message.slice(1,-1).split(", ");
                            this.config.tk_uid = data.message[0]
                            this.config.pp =  data.message[1]
                            //生成poolid
                            this.config.poolId = CryptoJS.MD5(CryptoJS.MD5(this.config.user_id).toString() + this.config.pp).toString();
                            this.config.poolId = this.config.poolId.slice(0,8)+"-"+this.config.poolId.slice(8,12)+"-"+this.config.poolId.slice(12,16)+"-"+this.config.poolId.slice(16,20)+"-"+this.config.poolId.slice(20,32)
                            GM_setValue("poolId",this.config.poolId);
                            //
                            GM_setValue("ti_uid",this.config.tk_uid);
                            GM_setValue("pp",this.config.pp);
                            // document.cookie = "ti_uid="+this.config.tk_uid+";max-age="+60 * 60 * 3;
                        }
                    }
                }
            }));

            
        }
        document.getElementById("tiku_user").value=this.config.tk_uid;
        

        if(this.config.m === "reply"||this.config.m === "person_quiz_result"){
            $('#zhu').append("<button id='x_start' >开始搜题</button>");
            // document.getElementById("zhu")
        }
        if(this.config.c === "res"){
            $('#zhu').append("<button id='x_res' >一键完成资源</button>");
        }
        if(this.config.m === "quiz_ranking" || this.config.m === "start_quiz_confirm"){
            $('#zhu').append("<button id='x_yue' >提前阅卷</button>");
        }
        if(this.config.m === "person_quiz_result"){
            if(!GM_getValue(this.config.id)){
                this.get_quiz_result(this.config.id,this.config.user_id,this.config.clazz_course_id);
            }
        }
    }

    MyPage.prototype.get_quiz_result=async function(id,user_id,clazz_course_id){
        if(this.config.tk_uid == null);
            let res = await (this.personResult(id,user_id,clazz_course_id));
            // if(res.result_code != 0){
            //      return alert(res.result_msg);
            // }
            answers = this.resoluAnswers(res);
            if(answers == null){
                _this.dumpData = this.config;
                return;
            }
            let obj={
                "poolId": this.config.poolId,
                "token": "06e599f3-78db-4c71-b4fa-2b496beab1f6",
                "userId":   this.config.tk_uid,
                "tags":[answers.title,"云班课"],
                "title":answers.id,
                "problems":[],
            };
            let data={};
            answers.rows.forEach(row=>{
                data={
                    "tags":     ["云班课"],
                    "text":     row.subject,
                    "answer":   JSON.stringify(row.answers),
                };
                data.tags.push(row.type);
                let l = ["choice_A","choice_B","choice_C","choice_D","choice_E","choice_F","choice_G","choice_H","choice_I","choice_J","choice_K","choice_L","choice_M","choice_N","choice_O","choice_P","choice_Q","choice_R","choice_S","choice_T","choice_U","choice_V","choice_W","choice_X","choice_Y","choice_Z"];
                let i=0;
                row.options.forEach(option =>{
                    data[l[i]]=option;
                    i=i+1;
                })
                obj.problems.push(data);
            });
            this.upladApi("http://121.37.103.75:10086/tiku/api/v1/problems",obj).then((resutData)=>{
                if(resutData.result==="success" && !!resutData.json){
                    var data = JSON.parse(resutData.json).data;
                    console.log(data);
                    GM_setValue(id,1);
                }else{
                    console.log(resutData);
                }
            });
    }


    MyPage.prototype.toLog=function(explain){
        //alert('啊绿: '+explain);
        this.initData();
        return this;
    }
    MyPage.prototype.findproblem = async function(text){
        let obj={
            "poolId": this.config.poolId,
            "token": "06e599f3-78db-4c71-b4fa-2b496beab1f6",
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "contains",
                "argument1":"problemText",
                "argument2":text,
            }
        }
        /////
        await(this.upladApi("http://121.37.103.75:10086/tiku/api/v1/queryProblems",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = JSON.parse(resutData.json).results;
                //处理数据，添加标识头
                let obj = {
                    flag: "metoproblems",
                    problems : data,
                }
                this.config.answer =this.resoluAnswers(obj);
            }
        }))
    }

    MyPage.prototype.findproblems = async function(problems){
        let answer = []
        let obj={
            "poolId": this.config.poolId,
            "token": "06e599f3-78db-4c71-b4fa-2b496beab1f6",
            "userId":   this.config.tk_uid,
            "querry": {
                "operator": "mulit",
                "argument1":"1",
                "argument2":"2",
                "problems":[]
            }
        }
        /////
        problems.forEach(problem =>{
            
            let problemobj = {
                "operator": "==",
                "argument1": "problemText",
                "argument2": problem,
            }
            obj.querry.problems.push(problemobj);
        })
        await(this.upladApi("http://121.37.103.75:10086/tiku/api/v1/queryProblems",obj).then(async (resutData)=>{
            if(resutData.result==="success" && !!resutData.json){
                var data = JSON.parse(resutData.json).results;
                //处理数据，添加标识头
                let obj = {
                    flag: "metoproblems",
                    problems : data,
                }
                answer = this.resoluAnswers(obj)
                // console.log(this.config.answers);
            }
        }))
        return answer
    }
    
    MyPage.prototype.start = async function(){ //搜题按钮实现
        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        function random(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        let config = this.config,$ = this.$;
        let HtmlUtil = this.HtmlUtil;
        let answers =  await(this.getAnswers(config.id,true));

        if(this.config.tk_uid == null || (answers == null)||JSON.stringify(answers) == '{}'  || answers.rows.length <= 0){
            let subjects = []
            $('.topic-item').each(function(index,div){
                let Id = $(div).find('a').attr('name');
                let subject = $(div).find('.t-subject.t-item.moso-text.moso-editor').text();
                subject = HtmlUtil.htmlDecode(subject),
                subjects.push(subject);
            })
            answers = await(this.findproblems(subjects));
        }
        let aner = $('body').find("#aner")
        aner.css("display","block")
        console.log(answers)
        if(JSON.stringify(answers) == '{}' || !(answers.rows)){
            aner.text("没有搜索到答案，若提前阅卷时有答案，但此时没有请反馈")
        }else{
            aner.text("总共搜索到"+answers.rows.length+"题")
        }
        

        $('.topic-item').each(function(index,div){
            let Id = $(div).find('a').attr('name');
            let flag_FT = false
            //console.log($(div).find('.t-subject.t-item.moso-text.moso-editor').html());
            let subject = $(div).find('.t-subject.t-item.moso-text.moso-editor').text();
            subject=HtmlUtil.htmlDecode(subject);
            // subject=escapeto(subject);
            //let space = new RegExp(`${String.fromCharCode(160)}`,"g"); /* no breaking space*/
            // console.log(subject);
            if( $(div).find('.show_answer').length == 0){
                $(div).find('.t-con').append("<div class='show_answer'></div>")
            }
            answers.rows.forEach(row=>{
                row.subject=HtmlUtil.htmlDecode(row.subject);
                if(row.subject == subject){
                    $(div).find('.show_answer').text("答案："+JSON.stringify(row.answers)).css('color','red'); // 添加答案在后方
                }
            });
            let $options = $(div).find('label');
            if($options.length == 0){
                $options = $(div).find('input');
            }
            $options.each(function(i,label){
                let content = $(label).find('.option-content.moso-text.moso-editor').text();//单多选题答案获取
                if(content == ""){
                    content = $(label).find('.el-radio__label').text();//判断题答案获取
                    flag_FT = true
                }
                answers.rows.forEach(row=>{
                    if(row.subject == subject){
                        if ($(label).find(".is-checked").length) {
                            return;
                        }
                        if(content == ""){
                            //填空题
                            if(Array.isArray(row.answers[i])){
                                $(label).val(row.answers[i][0]);
                            }else{
                                $(label).val(row.answers[i]);
                            }
                            ev = document.createEvent("HTMLEvents");
                            ev.initEvent("input", true, true);
                            $(label)[0].dispatchEvent(ev);
                        }
                        row.answers.forEach(async answer =>{
                            if(flag_FT == true){
                                if (answer == "T"){
                                    answer = "正确"
                                }else if(answer == "F"){
                                    answer = "错误"
                                }
                            }
                            try{
                                if(content == answer){
                                    $(label).css('color','red');
                                    await sleep(random(500,1000))
                                    $(label).click()
                                    
                                }
                            }catch (e){
                                console.log("发生异常:" + e);
                            }
                            
                        });
                    }
                });

            });
            
        });
        // alert('阿绿: 操作完成，微信关注宁财小助手');
        window.my.config.timenum = answers.rows.length * 4
        $(".my-sticky-bottom").children("button:first").attr('id', 'submit')
        window.my.config.timer = setInterval(function() {
            window.my.config.timenum--
            if (window.my.config.timenum < 0) {
                $("#submit").text("交卷")
                $("#submit").attr("style", "")
                $("#submit").attr('disabled', false)
                clearInterval(window.my.config.timer)
            } else {
                $("#submit").attr('disabled', true)
                $("#x_start").attr('disabled', true)
                $("#submit").attr("style", "width:250px")
                $("#submit").text("请在" +window.my.config.timenum +"秒后交卷")
            }
        }, 1000)

        let classListData = await (this.join_class());
        if(classListData.length > 0 ){
            classListData.forEach(cl =>{
                this.get_page(cl.id).then((result) =>{
                    $(result).find(".interaction-row.interaction-row-open-enable").each(async function(index,div){
                        let id = $(div).attr('data-id');
                        let type = $(div).attr('data-type');
                        let status = $(div).attr('data-row-status');
                        if(type=="QUIZ"){
                            if(!GM_getValue(id)){
                                await(window.my.get_quiz_result(id,window.my.config.user_id,cl.id));
                            }
                        }
                    })
                });
            })
        }
        //题库获取模块 end    
    }
    _this.MyPage = MyPage;
})(window);


window.my = new window.MyPage({
    id:"wzq",
    width:80,
    background:'#fff',
    opacity:2,
    pos:{
        x:100,
        y:100
    }
}).toLog('私人圈子传播，请勿外传');