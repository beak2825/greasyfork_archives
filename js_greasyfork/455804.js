// ==UserScript==
// @name         医教在线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给女朋友做的，在医教网站首页会开始自动学习，如果不想自动学习，可以关闭此插件。
// @author       羊羊羊
// @match        *.ejiao.net.cn/*
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455804/%E5%8C%BB%E6%95%99%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/455804/%E5%8C%BB%E6%95%99%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function () {
    let url = location.href;

    if (url.match("www.ejiao.net.cn/Index.aspx")) {
        setTimeout(() => {
            window.open("http://www.ejiao.net.cn/Member.aspx", "_blank");
            closeWindows();
        }, 3000);
    };

    if (url.match("www.ejiao.net.cn/Member.aspx")) {
        setTimeout(() => {
            let classList = $($(".layout_main")[1]).find("dl");
            for(let item of classList){
                let remainder = $(item).find("span:last")[0].innerText;
                console.log("未学课件：",　remainder);
                if(remainder != 0){
                    let url = $(item).find(".go_couseList")[0].href;
                    window.open(url, "_blank");
                    closeWindows();
                    break;
                }
            }
        }, 3000);

    }

    if (url.match("www.ejiao.net.cn/ContinuingProject.aspx")) {
        setTimeout(() => {
            let classList = $("tr");
            for(let i = 1; i < classList.length; i++){
                let state = $(classList[i]).find("td:eq(2)");
                console.log(state);
                if(state[0].innerText == "未学习" || state[0].innerText == "学习中"){
                    let url = $(classList[i]).find("td:eq(3)")[0].childNodes[0].href;
                    window.open(url, "_blank");
                    closeWindows();
                    break;
                }
            }
        }, 3000)
    }

    if (url.match("www.ejiao.net.cn/ContinuingProjectCourseware.aspx")) {
        function myAlert (str) {
            console.log(str);
            window.open("http://www.ejiao.net.cn/Member.aspx", "_blank");
            closeWindows();
        }
        unsafeWindow.alert = exportFunction (myAlert, unsafeWindow);
    }

    function closeWindows() {
        var browserName = navigator.appName;
        var browserVer = parseInt(navigator.appVersion);
        //alert(browserName + " : "+browserVer);

        //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";

        if(browserName == "Microsoft Internet Explorer"){
            var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;
            if (ie7)
            {
                //This method is required to close a window without any prompt for IE7 & greater versions.
                window.open('','_parent','');
                window.close();
            }
            else
            {
                //This method is required to close a window without any prompt for IE6
                this.focus();
                self.opener = this;
                self.close();
            }
        }else{
            //For NON-IE Browsers except Firefox which doesnt support Auto Close
            try{
                this.focus();
                self.opener = this;
                self.close();
            }
            catch(e){

            }

            try{
                window.open('','_self','');
                window.close();
            }
            catch(e){

            }
        }
    }
})();