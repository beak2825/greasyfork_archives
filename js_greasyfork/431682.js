// ==UserScript==
// @name         dingdong
// @namespace    dingdong.web
// @version      7.0
// @description  美化叮咚，提升效率
// @author       realyuxia
// @match        http://ts.ht1020.com/index.php?act=do_taskweb
// @downloadURL https://update.greasyfork.org/scripts/431682/dingdong.user.js
// @updateURL https://update.greasyfork.org/scripts/431682/dingdong.meta.js
// ==/UserScript==
(function () {
    var excludeList = ["描述|缺一不可|样图|一律封号|会一一核对头像审核通过|然后根据提示|点击菜单弹出内容|不准取消关注|切记|名称|必须有最新的回复和最新的菜单点击|请至少保留一个月不要取关感谢大家|再点击全部菜单栏一下|三天内不能马上取关|检测马上取关的一律不通过|关注后按照图中要求点击两个菜单并打开网址|看不到的点击中间更多就显示出来了|一定不要点错了|跪求一礼拜不取关|谢谢|并且截图时间与上传时间吻合|否则会被封号|加人加好友任务截图必须带已发送字样|跪求三天不取关|感谢大家|保留一个星期|不要取消关注"];
    var keywordsList = ["搜|关注|回复|关注过|关键字|公众号|发送"];

    addWechatButton();
    clickablePic();
    enableTextCopy(excludeList, keywordsList);
    overrideAlert();
    removeExtraNodes();

    /*filers*/
    function gettype(w, excludeList, keywordList) {
        var type = 0;

        keywordList.forEach(function (k) {
            var r = new RegExp(k);
            if (r.test(w)) {
                type = 1;
            }
        });
        excludeList.forEach(function (e) {
            var r = new RegExp(e);
            if (r.test(w)) {
                type = 2;
            }
        });
        return type;
    }


    function addfloatbutton(node){
      var div=document.createElement("div");
      div.style.cssText="border:2px solid red;position:fixed;top:80%;left:80%;width:40px;height:40px;background-color:yellow;z-index:999999;text-align:center;line-height:40px;color:red;box-shadow: 3px 3px 5px #888888;";
     div.style.webkitAnimation="shiftN  200ms ease-in-out";
     div.addEventListener("animationend",function(e){
      div.style.webkitAnimation="";
      });
      node.setAttribute("isShow", "hidden");
      node.style.display="none";
      div.textContent="展开";
      div.addEventListener("click",function(e){
         div.style.webkitAnimation="shiftN  200ms ease-in-out";
         div.addEventListener("animationend",function(e){
           div.style.webkitAnimation="";
         });
         if (node.getAttribute("isShow") === "show"){
           node.style.display="none";
           node.setAttribute("isShow", "hidden");
          div.textContent="展开";
         }else if(node.getAttribute("isShow") === "hidden"){
           node.style.display="block";
           node.setAttribute("isShow", "show");
          div.textContent="关闭";
         }
         e.stopPropagation();
      });
  document.body.appendChild(div);
    }
    /*文字可复制*/
    function enableTextCopy(e, k) {
        var keyWords = [{ name: "name", key: "名称:" }, { name: "description", key: "描述:" }];

        var head = document.head;
        var style = document.createElement('style');
        var shiftA = "@keyframes shiftN{0%{-webkit-transform:scale(0.5);}50%{-webkit-transform:scale(1.2);}100%{-webkit-transform:scale(1.0);}}";

        var fonts_tag = document.getElementsByTagName('font');

        var targetNodes = getNodesByTextKeywords(keyWords, fonts_tag);
        var name_node = null;
        var des_node = null;
        
        /*add @keyframs */
        style.innerText = shiftA;
        style.type = 'text/css';
        head.appendChild(style);
        
        
        if (targetNodes.length === 0) {
           return ;
        } else if (targetNodes.length === 1) {
           name_node = targetNodes[0].node;
           name_node.style.cssText = "border:2px dotted #F4A460;display:inline-block";
           name_node.addEventListener('click', function (e) {
            e.target.style.webkitAnimation = "shiftN 800ms ease-in-out ";
            e.target.addEventListener("animationend", function (e) {
                /*clear webkitAnimation attribute, for animation re-occoring*/
                e.target.style.webkitAnimation = "";
            });
            clipText(e.target.textContent);
            e.stopPropagation();
           });
        } else {
            name_node = targetNodes[0].node;
            des_node = targetNodes[1].node;
            
            name_node.style.cssText = "border:2px dotted #F4A460;display:inline-block";
        name_node.addEventListener('click', function (e) {
            e.target.style.webkitAnimation = "shiftN 800ms ease-in-out ";
            e.target.addEventListener("animationend", function (e) {
                /*clear webkitAnimation attribute, for animation re-occoring*/
                e.target.style.webkitAnimation = "";
            });
            clipText(e.target.textContent);
            e.stopPropagation();
        });

        formatSentence(des_node, gettype, function (e) {
            e.target.style.webkitAnimation = "shiftN 800ms ease-in-out ";
            e.target.addEventListener("animationend", function(e){
                  e.target.style.webkitAnimation = "";
            });
            clipText(e.target.textContent);
            e.stopPropagation();
        });
        }



        function getNodesByTextKeywords(keys, nodeCollections) {
            var ks = keys;
            var ns = nodeCollections;
            var result = [];
            var na = [];

            if (!(ks instanceof Array) || ns.length === 0) { return; }
            var forEach = Array.prototype.forEach;
            forEach.call(ns, function (node) {
                na.push(node);
            });

            na.forEach(function (n, i) {
                ks.forEach((k, j) => {
                    if (new RegExp(k.key).test(n.textContent)) {
                        result.push({ name: k.name, node: n });
                        na.splice(i, 1);
                        ks.splice(j, 1);
                    }
                });
            });
            return result;
        }

        /*打散节点文字 并且让其可复制*/
        function formatSentence(node ,gettype, clickhandler) {
            var colors = ["#122656", "#73500c", "#FF6666", "#FF33CC", "#CCCC99", "#663366", "#CCCCFF", "#FFFFCC", "#CCFFFF", "#99CC33", "#FF9900","#FFCC00"];
            var nodeText = node.textContent;
            var parentNode = node.parentNode;
            var newSpan_node = document.createElement('span');
            var div_node = document.createElement('div');
            var ws = [];

            div_node.style.cssText = "display:block;margin:20px";
            ws = sentenceSplitToWords(nodeText);
            
            ws.forEach((w)=> {
                var index = Math.floor(Math.random()*12);
                var n = newSpan_node.cloneNode(false);
                n.style.cssText = "font-size: large;display:inline-block;border: 2px dotted #F4A460; margin:10px;";
                /* type 1 target; type 2 exclude ; type 0 normal*/
                
                switch(gettype(w, e, k)){
                    case 0:
                        n.style.textShadow = "1px 1px 3px" + colors[index];
                        break;
                    case 1:
                        n.style.backgroundColor = 'DeepPink';
                        break;
                    case 2:
                        n.style.display = "none";
                        n.style.visibility = "hidden";
                        break;
                    default:
                }

                n.textContent = w;
                n.addEventListener("click", clickhandler);
                div_node.appendChild(n);
            });
            parentNode.insertBefore(div_node, node);
            var div_text = document.createElement('div');
            var imgs = document.querySelectorAll("img[width='300px']");
            var div_img = document.createElement('div');
            div_img.style.display = 'flex';
            div_img.style.margin = "10px";
            
            for (i=0; i<imgs.length; i++) {
                imgs.item(i).style.width = '50%';
                //enableClick(imgs.item(i), '50px');
               
                div_img.appendChild(imgs.item(i));
            }
            div_text.innerText = node.textContent;
            parentNode.insertBefore(div_text, node);
            addfloatbutton(div_text);
            parentNode.insertBefore(div_img, node);
            
            parentNode.removeChild(node);
        }

        function sentenceSplitToWords(sentence) {
            var s = sentence;
            var reg = /[a-zA-Z0-9\u4e00-\u9fa5]+/g;
            var ws = [];

            var match = reg.exec(s);
            while (match) {
                ws.push(match[0]);
                match = reg.exec(s);
            }
           return ws;
        }
    }
    /*移除多余节点*/
    function removeExtraNodes() {
        var tagAs_node = document.getElementsByTagName('a');
        var btn = document.querySelectorAll("button[class='btn']");

        var a_node = null;
        for (i = 0; i < tagAs_node.length; i++) {
            var reg = new RegExp('长按图片保存');
            var text = tagAs_node.item(i).textContent;
            if (reg.test(text)) {
                a_node = tagAs_node.item(i);
            }
        }
        if (a_node) {
            a_node.parentNode.removeChild(a_node);
        }

        for (i=0; i<btn.length; i++) {
            btn[i].parentNode.removeChild(btn[i]);
        }

    }
    /*添加微信按钮*/
    function addWechatButton() {
        var topBar_node = document.querySelector('section.btn');
        var a1_node = document.querySelector("a[href='index.php']");
        var a2_node = document.querySelector("a[href='index.php?act=do_taskweb']");
        var a3_node = document.querySelector("a[href='index.php?act=giveup']");

        /*re-layout*/
        a1_node.style.cssText = "width:20%;margin-right:4%;float:left";
        a2_node.style.cssText = "width:20%;margin-right:4%;float:left";
        a3_node.style.cssText = "width:20%;margin-right:4%;float:left";

        var wechat_node = document.createElement('a');
        wechat_node.style.cssText = "width:20%;margin-right:4%;float:left;display:block;background:#ffc501;border:node;border-bottom:2px solid #f2b206;color:#fff;text-align:center;height:40px;font-size:18px;line-height:40px;border-redius:8px;";
        wechat_node.href = "weixin://";
        wechat_node.innerText = "微信";

        topBar_node.appendChild(wechat_node);
    }

    /*图片可点击放大*/
    function clickablePic() {
        var img1_node = document.getElementById('uploadimg');
        var img2_node = document.getElementById('uploadimg2');
        var img_node = document.querySelector("img[width='100px']");

        enableClick(img_node, '100px');
        enableClick(img1_node, '80px');
        enableClick(img2_node, '80px');
    }


    /*重写页面alert*/
    function overrideAlert() {
        var input_node = document.querySelector('input[onclick="copyimgurl()"]');
        if (input_node) {
            input_node.onclick = mycopyimgurl;
        }
        function mycopyimgurl() {
            var Url2 = document.getElementById("imgurl");
            Url2.select();
            document.execCommand("Copy");
            showToast('复制成功', 1500);
        }
    }

    /* util */
    function enableClick(node, preWidth) {
        if (node) {
            node.addEventListener('click', function (e) {
                var width = window.getComputedStyle(node).getPropertyValue('width');
                if (width === preWidth) {
                    node.style.width = '100%';
                    node.style.height = '100%';
                } else {
                    node.style.width = preWidth; 
                    node.style.height = preWidth;
                }
                e.stopPropagation();
            });
        }
    }

    function clipText(source) {
        var m = document.createElement('input');
        var body = document.querySelector('body');

        body.appendChild(m);
        m.value = source;
        m.select();
        document.execCommand('copy');
        body.removeChild(m);

        showToast('复制成功', 1500);
    }

    function showToast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg.toString();
        m.style.cssText = "width:60%; min-width:180px; background:#000;opacity:0.6; height:auto;min-height: 30px;color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:5%; left:20%;z-index:999999;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }

})();