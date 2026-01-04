// ==UserScript==
// @name        论坛网盘链接免密提取
// @namespace   http://xhunter.vicp.io
// @description 激活网盘链接,同时自动填写密码,支持绝大多数Discuz论坛,zd423网站
// @include     http*://www.52pojie.cn/forum*
// @include     http*://www.52pojie.cn/thread*
// @include     *://pan.baidu.com/share/init?*
// @include     http*://bbs.zhiyoo.com/forum.php*
// @include     http*://www.right.com.cn/forum/*
// @include     http*://bbs.ydss.cn/thread-*
// @include     http*://bbs.ydss.cn/forum.php?mod=*
// @version     1.0.8
// @author      hunter
// @require     http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30883/%E8%AE%BA%E5%9D%9B%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%85%8D%E5%AF%86%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/30883/%E8%AE%BA%E5%9D%9B%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%85%8D%E5%AF%86%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
(function() {
    function activiteLink($dom, linkList) {
        var docu = $dom.html();
        for (var i = 0; i < linkList.length; i++) {
            docu = docu.replace(new RegExp(linkList[i].url+"(?=[^#])", "gm"),"<a target='_blank' class='btn btn-url' style='color:#d00' href='" + linkList[i].url + '#' + linkList[i].password + "'>一键提取</a> ");
        }
        $dom.html(docu);
    }
    function Link() {
        this.url = null;
        this.password = null;
        this.addLink = function(link, password) {
            this.url = link;
            this.password = password;
        };
    }
    var linkList = new Array();
    var urlExp = /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/(?:s\/\w*|share\/(\w|-)*))/g;
    var isInSharePage = location.href.match(urlExp);
    if (isInSharePage) {
        isInSharePage = location.href;
        var password = isInSharePage.match(new RegExp("(#\\w{4})$", "gm"));
        if(password == null){
            $("#tip").text("没有在上下文找到密码");
        }else{
            password +="";
            password = password.substring(1); 
            $(":input").val(password);
            $(".g-button-right :contains('提取文件')").click();
        }

    } else {
        var $docHTML = $("body").html();
        var $docText = $("body").text();
        var $script = $("script");
        var regRuleLink = "((?:https?:\\/\\/)?(?:yun|pan|eyun).baidu.com\\/(?:s\\/(\\w|-)*|share\\/\\S*\\d)(#\\w{4})?)";
        var regSplit = "\\s*(密|密码|提取码|访问码|提取密码|访问密码)(\\s|\\:|：)*(本帖隐藏的内容)?";
        var regRulePwd = "\\w{4}";
        var regRuleTotal = regRuleLink +"("+ regSplit + regRulePwd+")?";
        var regExp = new RegExp(regRuleTotal, "gm");
        var shareArray = $docText.match(regExp);
        var urlArray = new Array();
        var urlExp = new RegExp(regRuleLink, "gm");
        var pswExp = new RegExp(regSplit + regRulePwd, "gm");
        var pswArr = new Array();
        if (shareArray != null) {
            for (var i = 0; i < shareArray.length; i++) {
                if (urlArray.indexOf(shareArray[i].match(urlExp)[0]) == -1) {
                    var link = new Link();
                    link.url = shareArray[i].match(urlExp)[0];
                    if(shareArray[i].match(pswExp) != null){
                        link.password = shareArray[i].match(pswExp)[0];
                    }else{
                        link.password = "";
                    }
                    linkList.push(link);
                }
            }
        }
        var pswArray = new Array();
        for (var i = 0; i < linkList.length; i++) {
            var link = linkList[i];
            if(link.password!=""){
                link.password = link.password.match(new RegExp(regRulePwd, "gm"))[0];
            }
        }
        $(".t_f").each(function() {
            activiteLink($(this), linkList);
        });
        $(".ratl").each(function() {
            activiteLink($(this), linkList);
        });
        $(".entry").each(function() {
            activiteLink($(this), linkList);
        });
    }
})();