// ==UserScript==
// @name      谷歌百度搜索（集合） 改
// @namespace  http://www.findhao.net
// @author    原作者 FindHao
// @version    1.1.6
// @description  分别在百度和google的搜索结果页面增加搜索跳转按钮。
// @icon https://resource01.ulifestyle.com.hk/res/v3/image/content/2130000/2132767/20180807_googlebaidu_03_1024.jpg
// @include        https://www.google.com.hk/*
// @include        http://www.google.com.hk/*
// @include        https://ipv6.google.com.hk/*
// @include        http://ipv6.google.com.hk/*
// @include        http://www.google.com/*
// @include        https://www.google.com/*
// @include        http://ipv4.google.com/*
// @include        https://ipv4.google.com/*
// @include        http://ipv6.google.com/*
// @include        https://ipv6.google.com/*
// @include        http://www.baidu.com/*
// @include        https://www.baidu.com/*
// @copyright      2018+, FindHao
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/432138/%E8%B0%B7%E6%AD%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%88%E9%9B%86%E5%90%88%EF%BC%89%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/432138/%E8%B0%B7%E6%AD%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%88%E9%9B%86%E5%90%88%EF%BC%89%20%E6%94%B9.meta.js
// ==/UserScript==
if ("undefined" == typeof(jQuery)) {
    loadJs("for_google", "https://code.jquery.com/jquery-2.2.4.min.js", callbackFunction);
} else {
    $(document).ready(function() {
        function baiduswitchgoogle() {
             //$('.s_btn_wr').replaceWith('<span class="bg s_btn_wr"><input type="image" id="su"  src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gsaBjEzoiyM1QAABrxJREFUaN7Vm39wXFUVxz/nbd4mlk4lZUIdqQziWIqIDvYHaXbTEui0pRZ/jhXBURgZRxloscMM3U2jj2mzaVFgsFpsR2HqoIwtjFI6qR3/iGR3k1QiWIqdWmdQ0Fag1LRBNM3bfcc/kpHG7tu97+1uszn/ZGbffee+z3v3nvO9594I1bD7MpdSxwPAUiAP/JgTDQ475rtMstVV3OOG9AqU3cD0s35N0jQyC7jD2E+itwmxbkOYA7KXzpY9IFru40lFYRPZRVjaA9QXuKpAC53xgdIvrfczqPUY0Pju3fIIqdg95T6iVTFYZ3Aalj7hAzv+cuX2kn6SmdWo9fQEWADRtSQzd9QOsDtyJ3B58UYaLz5C0nMQHvd9LmEjTk9DDQCrAGsMGs4u/jSyFZhWpMX7cKPLJx+4vX8B8IGyYkZ7phlYVtqFd30NfGFvhWHDN4tc+5phnP1QLczhZsN2h4tMic8Z+rBrAXiu4VQ/UDgNDcwFZhr2NVQLwBcZtYp4ewu/iPzHAvT1h1oANlFsh9jYerDwtJSZxj2p7K0F4DcN2jzoD6HDhv38llTs5VoAPlAiGfVz9PgT/kHee9Ggj1EsLVta+udF549R3FN3gd6I6lwseRXlV9juj3Da/jVRDvYtR7xf+3j6G5JfwqYlfymey7PPgq7yGwPA7XTGd1ZHWn5hVwR36BnQB4GliMxGiQHfxbVfIdEbm9A+1bIflUcKzM3nyOt1JWEB8t5XENIFUI+jfLISsP5fuD1zD/BwkftOYcsVOLGJc7cju4C8txgRweMAXfF0YIm6IXMDKgtRIoi8xIn67kquo88FdtRiNPMqIrNL3LuZzniCKWbnppN85hoDWIBVwOQDJ7MfRfReYAWQA36JS5IH4m+bAavVMhYjStoVY5Kw/CpEuPX3wAzc3DbQL/1fLLoLm0U4PdedE1wLBy1daKxp794XnRzYngtxc2ngVp/AOw/X3mgWpZXLDLt9h60rz0wKsGv/HCglR+/EGZhtkpZMI+KhSZqzNwM3GrSMksvfZPCF5aXzoWlDV1ZEO8yba8wgaPELhLUlXP2T6Oj2QM+aSM8hYsXwvIuxrGE8PULUTeO05cx9ZOPARwL02lQauCvWT3vmZ+MBoaDyRfkyTttbRl12pD+OylaUVlRBhLG/wKh9nA3ZzdS1/BBHvNK6UFcFqyxrxExaunwTZHeBK8dQbxmp+D6zWlfmq3jSj9LqI3vej+r3cbP7uHf/BQYe5wWTVXLMbB07lrRX056ZDyxFVREOY8/cj3PVqCHsrcDjmH2SZdRf0M3XB5cWl5FGgujs6Xko2MK9Mz4IDAaOLYnsItDHCDb+FtP0n03AfUUIvEAuPa+7Wuvhs0XBdCx2AiFEiawj0VskKMmRAM4G6Fp8uPrAbt1DoB8Ore0ta1ORrLQnwHD+djUrHuNDOdMKUu7+z2fHpkQBe/v0k8BRg5GyjVT8N9UFvru7Hku3U4kdSUs7C/6+deUZVD4PnCwCu5vh0+uqXdOC985oB7myQt7afHcKU7GXQeah7AHOzt1vIKzDbrm5mMavzP5wR3YBnmbCBSpfG0G9GKnFL/jr6oFZaG4O4p0metERk5RZPnCitwnLOgB8sAri+Riet6xQtK1sEc/UNqRXYFkHqwQLcAmW9ZxvEKtITcvE1qcbibBlPCIL1bccyGbsCzcaK72KAScztyA8BMw6/8tD+TPo/dixJ40WG2UBr++/jEj+0fFi2WTbUWAndt1PcZr/Xnng9swXgR3ADGrLRoAfYLv3FyrYhQBWIdn3MKJrqWnT3+FFV9J17ckyorQK7dlttQ8LIAuJ5J7GUSs8cLIvCXyDqWKqS3Aznw4HvD59OaLfYaqZym3hgC1rDWUeHpmckc31pYa1z4k3333aWrfpjAxcGgz4W33voeQRwho2WxuDATdEpp0nuVgly3vBgOv//Q6G24e1yWu/HgzYaRtB+ccUxf0rqeY3QgStEqdyajdM94dLS0r31OTVp8IBR+t2AcNTDPcV/nT8mXDATvMwyuappbLoYvfqfHgt/VbD90D7pghuN6nYT0wa+gPvmO/iRT8FvFjjsIPkGm4xPVxTfDnVde1J7IY4ynYm1oDLsTOM/fNWJVZIT2E3LGHL/NOVrXgAdPRdjeetAW7CrJ41BPwe4XlUn8eSo+Ts1/+3SHd66jgTacSKXIl414B8AuUG4BID3ydAHTrjjwY9NhVOQib65iL5hYhcDDQiUo96pxCGUF4jJwfZEn8tlO+OzFV4shylFdGrefek/BCqLwDPEs3twmkbCeP+v8UeKLAXusZdAAAAAElFTkSuQmCC" style="height:35px;padding-right: 10px;padding-left: 10px;"></span>');
            $('.right-tools-wrapper').after('<span class="bg s_btn_wr" style="width: 50px;"><input type="image" id="ggyx"  src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABuwAAAbsBOuzj4gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAa3SURBVHja3Zt7bFNVHMfPYBNBJvKYPGKUEFhXNp7dbalbtGvvbTcCcw+mkQQ0RMFoAlkWxVd0JCKQsA3GgECGf4iZOhzQ9WHXDqaTBGIQRSegKKIEJAzZ2m5rV8aOv1PXrZtl632tt/3jmyZ93HO+n57z+/3OuecijDESU3doxaR2mqKdNPWuS6uqc+qUzaAWp466Dq8eUAfoCug0fMcI3zkIn21p16r0WK0eL3b/RLmoO4tKddHK7WDqAqgXhDkKAFF2l44q6aDVCyQNoD0zc7KTVhZDp8/xMDySvndqlc/joqKx0gEAw7Rdq9wM5u+IaHyoYMpQrwoxRbj/GKG4dlq1vm8u44hIq7wF4NeOOoBOg2ImNN4YMeNDBDHiC5dOOXVUAEBDK6DRVqmYD9INGI3ZogKAFLVNgsaD5XYyqnnCAyhFY2CYHZC4+attWcpFwo8AjSYeAk2NlM1DFvrKpVFMEyUGQLD7XNL/vFa5DysUCaJkAVK+Sti8r12n3CBaHeDKWpbLs4wVNf+7tdRTolWCJJJCQy6BO/4bqB7+tR2QSl9watOVrRkZiTdWKibc0akWttFUAbz/BlkMwev54crhNu2TT4haCkMHTgho3EbMsl5QMdTTBFjwKIQFVi0BJupiiCw2hKnOlCddTHoG3w7CdZIhC+2HSP+O6KvBf3JUD0Pn/+Zp/lKbTpUl9jpeFACeqinvOXMUnTzMt3ToVNOjxfxgAFDt+RzoL1/dA9i9Oo19MaKjfnTnLEmKJvODANxtRPRdB8J+WcfgjtfmspnvP3CtxCQDwNeIDvcD6FPXllnhAPjZaVBPiUbzAwBOoUQw3DkUAJF332QMcWGYOlylj1bz/QBg7q8LZT6g7prx2FW4KNRGRFM0m+8HACabhwNA5KuPxx3rUgZDoFXLoh9AI5oKBntHAuBXQxzufH12n3nKGO3m/QAg+FFhmQ+S58MZN9369LSYANDTiFaxBXDXjlqE6kD+Ti+TX+71RkRl3ZsRmClhCwCgVQkGoNybDcKRUEG5dw/qcaBKDgBWxQIA0BGSAYxsAfjsaHFMAKjwfkMAnGcLANvQzBiZApcJgHaWAHpxE4qPkSngJgC8rAGcRQkxAsBFANxkPQXsaFaMALhEAFxiHQRPoKUxAuAkAXCGdRq0o/zYANB9mGyE1LIG4EB7YiILlHl3kBHwJgcAl2MBQF65dxMBYGALoNsRh2tsj6cKAaCwzLcEOnOcp05xK4S6CxC2oiQ25m87EvAaC9WTamZqpLKiIzU9BwA9+VWuqYENkdPhmL9on4gZSyZOMeuJepPrs6lIm8/d1TEdzHRxANA8sCVmRy+NZN7e8ChWmLUB837JzPrmSAOAebyTYxlcMrAp2oQmgkn3/cxX2eZgeZDxwcouiJT5/IoutX8ocwBQuNs7b9C2OOT26qHG3Y6xeKN10X2M9+uyzJibOOpDfwdOBCO/c8wAF/9/X8CBlgWb/9M+HudZ1COZD+jM4mOaR0bLvKYUx4OJo5xTYJl3Y8h7g2Sri5g/0zAZqy2acM3/J5PhXLJJM22UzB/hkf+v5VTicSEBwCgorrE9htPMDDvzA2pJtSyfIZb5or14Ihio41n9bbjv3eFSW+oUyO+tHM0H9KsY6bGgoiuDx5wPRP4r6w/ghGEPSKRYDKt5AvBLbtJb5Vaa942TZDM9Z2lt8YFndjnv8S59yzwvhnVEBgw4hIDgl0XfILMyrE+KyC16Bn5bD9e4R66zuO4VvKLyGh8AX8KF48ICkGo0zIVGuwSD0Dc1oJY4nmLSb5ObDGvJNCHpU2FaOQHeT5OZmVwwXQzBtAq+ezHUNVKNRdiw/zsu5m8UVbqTWB2TgyH8HCl3BYYgwNTKwVmHjGzM38ur8Gg4HZSEIfi+1AAEpP5kF86r6Awj6ntKOZ8URRjFySz6z6QKYWltCc7dfWsYAJ5PS0vxGF5nhedac8ZBY0elCmHBsTV4+d5fQqW86pHMh31cHtUWjYWVX7VUIcyvz8X0waZgALtDRXzeD0xApN4uVQgpZgPO/Li6A4b9VlEfmSHLX2jwtgQh3IIirnBUHpqS2wwzSYEjIfNHIFYl8Tomx/6HKA6Klpeh8esRHPatMovh2Yg+ODm7SfMgdKSEdGb0jDNXZSZm08IG/UOSeXSWlLWkU9DBs6IZNxnOkcWapkkTL+gxOaE1z0zLYURshRr/As9y2gs6Cf/42zILkx41T48Ha46DnjTfxOhgEfQWCVagr0E/9cUOD6gT9EeKhfkWjJrh9SMA90GKmTaQhZLY/fsXVyfSdyNkfiMAAAAASUVORK5CYII=" style="height:35px;padding-right: 10px;padding-left: 10px;margin-top:2px;" ></span>');
            $('#ggyx').on({
                click: function() {
                    //window.open("https://www.google.com/ncr?gws_rd=ssl#newwindow=1&q=" + encodeURIComponent($('#kw').val()));
                    window.open("https://www.google.com/search?hl=zh-CN&q=" + encodeURIComponent($('#kw').val()));

                    return false;
                }
            });
        }
        console.info(12356)
        if (window.location.search.lastIndexOf("wd=") > 0 || window.location.search.lastIndexOf("word=") > 0) {
            baiduswitchgoogle();
        }
        //检测从baidu首页进入的搜索（补漏）
        if (/^http(s)?:\/\/(www\.)?baidu\.com\/$/ig.test(window.location.href)) {
            $("#kw").off('click').on({
                keydown: function() {
                    if ($('#ggyx').length < 1 && encodeURIComponent($('#kw').val()).length > 0) {
                        baiduswitchgoogle();
                    }
                }
            }).on({
                paste: function() {
                    if ($('#ggyx').length < 1) {
                        baiduswitchgoogle();
                    }
                }
            });
        }
    });
}

function callbackFunction() {
    $(document).ready(function() {
        function googleswitchbaidu() {
            if ($('#sblsbb').length > 0) {
                $('#sblsbb').after('<button class="Tg7LZd" id="bdyx" aria-label="百度 搜索" type="button" style="width:45px"> <img  class="lsb" src="data:image/jpeg;base64,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" /> </button>');
                $('#bdyx').off('click').on({
                    click: function() {
                        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($("[name='q']")[0].value));
                        return false;
                    }
                });
            } else if ($('._wtf').length > 0) {
                $('._wtf').after('<button class="Tg7LZd" id="bdyx" aria-label="百度 搜索" type="button" style="width:45px"> <img  class="lsb" src="data:image/jpeg;base64,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" /> </button>');
                $('#bdyx').off('click').on({
                    click: function() {
                        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($("[name='q']")[0].value));
                        return false;
                    }
                });
            } else if ($(".Tg7LZd").length > 0) {
                $('.Tg7LZd').after('<button class="Tg7LZd" id="bdyx" aria-label="百度 搜索" type="button"  style="width:45px"> <img style="height:38px" class="lsb" src="data:image/jpeg;base64,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" /> </button>');
                $('#bdyx').off('click').on({
                    click: function() {
                        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($("[name='q']")[0].value));
                        return false;
                    }
                });
            } else {
                $('.sbico').after('<button class="Tg7LZd" id="bdyx" aria-label="百度 搜索" type="button" style="width:45px"> <img  class="lsb" src="data:image/jpeg;base64,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" /> </button>');
                $('#bdyx').off('click').on({
                    click: function() {
                        window.open("https://www.baidu.com/s?wd=" + encodeURIComponent($("[name='q']")[0].value));
                        return false;
                    }
                });
            }
        }
        if (window.location.hash.lastIndexOf("q=") > 0 || window.location.search.lastIndexOf("q=") > 0) {
            googleswitchbaidu();
        }
        //检测Google的直接搜索（补漏）
        if (/(www\.|ipv4\.)?google\.com/ig.test(window.location.href)) {
            $("#lst-ib").off('click').on({
                keydown: function() {
                    if ($('#bdyx').length < 1) {
                        googleswitchbaidu();
                    }
                }
            });
        }
    });
}

function loadJs(sid, jsurl, callback) {
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if (document.getElementById(sid) === null) {
        nodeScript = document.createElement('script');
        nodeScript.setAttribute('type', 'text/javascript');
        nodeScript.setAttribute('src', jsurl);
        nodeScript.setAttribute('id', sid);
        if (callback !== null) {
            nodeScript.onload = nodeScript.onreadystatechange = function() {
                if (nodeScript.ready) {
                    return false;
                }
                if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                    nodeScript.ready = true;
                    callback();
                }
            };
        }
        nodeHead.appendChild(nodeScript);
    } else {
        if (callback !== null) {
            callback();
        }
    }
}