// ==UserScript==
// @name          千山助手
// @namespace
// @description   为站点千山导航添加一些实用功能，比如搜索框、更换背景和导入备份等
// @include       http://qianshan.co/*
// @include       http://*.qianshan.co/*
// @version       3.0
// @copyright     2018,11,01; By duke
// @github        https://github.com/DukeLuo/qianshan-helper.user.js
// @namespace https://github.com/DukeLuo/QianShan
// @downloadURL https://update.greasyfork.org/scripts/369250/%E5%8D%83%E5%B1%B1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/369250/%E5%8D%83%E5%B1%B1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


;(function () {

// add html
var $styleBody = $("style[type='text/css']"),
    $body = $("body");

var cssStr = "";

cssStr += '.my-mb {  margin-bottom: 10px;}';
cssStr += '.my-btn-circle {  position: absolute;  top: 1%;  right: 1%;  width: 70px;  height: 70px;  padding: 16px;  border-radius: 35px;  text-align: center;  font-size: 12px;  line-height: 1.4;  z-index: 5;  outline: none !important;  box-shadow: 0 0 2px #555;}';
cssStr += '#search-bar {float: left; width:480px; padding: 4px 0 5px 10px; }';
cssStr += '#my-btn-search1,#my-btn-search2,#my-btn-search3 {  height: 46px;  background-color: #d3d7d4;}';
cssStr += '#my-btn-search1:focus, #my-btn-search1:active,#my-btn-search2:focus, #my-btn-search2:active,#my-btn-search3:focus, #my-btn-search3:active,#search-bar input[type="text"] {  outline: none !important;  box-shadow: none;}';
cssStr += '#my-btn-search1 {  width: 48px;  padding: 5px 6px;  border-top-left-radius: 23px;  border-bottom-left-radius: 23px;  cursor: default;}';
cssStr += '#my-btn-search3 {  width: 60px;}';
cssStr += '#search-bar .dropdown-menu {  height: 50px;  padding-left: 10px;  padding-right: 10px;  background-color: #f4f4f4;}';
cssStr += '#search-bar .dropdown-menu i {  display: inline-block;  width: 34px;  height: 34px;}';
cssStr += '#search-bar .dropdown-menu i:hover {  cursor: pointer;}';
cssStr += '#search-bar .dropdown-menu i + i {    margin-left: 8px;}';
cssStr += '.icon {  display: inline-block;  width: 100%;  height: 100%;  background-color: #ddd;  background-position: center;  background-repeat: no-repeat;}';
cssStr += '.menu {  background-color: transparent;  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAnElEQVRYhe3XsQ2DMBCF4X+AUGL6iOzDKBmFUbwJE7hmDYpYigtHurvGSHknvfIdnwwSMmi+MwGbMwlYAr2pB9iAE8jGFOBdUxy9sz6rC8jG0wLYG8Du6GUBBBBAgFsDSl1mydEADkev/AKkZqE1T2AN9OYeYAksWoFXoJd6gOGv4BYfoQACCCDAcMDQi0nkajbz+bF4ew/jaf3BXKaPuzPPNWkbAAAAAElFTkSuQmCC");}';
cssStr += '.google {  background-color: transparent;  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEyUlEQVRYhbVW/28TZRy+f0EhxkD8QxoHy+g6iSNEQIcgkkjUKBuOpZh0MJmt7EtHO4btaGGVDbeBqzooRbchJGIwxjETJENW6l2/7Hpvx8CA9+5ublwffzjWrO1tfYf4ST4/XN6793k+z/N5P/dyHGO0h++vbQ0pXmuvHNntp7TSJWfMLRTmFopKl5zZ7afU2itHnGHF0x6+v5Z136LROUw31vXJUYuTorSJLSucFNZ+GvGOUMtTA58MY3V9UBkra2YHzs8NLRT1A8po+/Cj51cE/vllWrGjk84+LXB+7jxBVe9lamYCPz6s7qx0y9qzAl/ITW5Z84wo24tW/n+AlzZRlDROodzOax2hKeO+8I3ILzxL2UubKN77QsmCm2w8TDYeW52x2eZBcVUBgfqgMraSzXf5FdT2qajtU1F9RsUH3QreP63g3YCCPV0K/Ff/wTejczngC2ntkcZywDuH6UbWbq8+o0K4p0HLAPMalgxZzaDiSCG4ycaj5CCPHCvq+uQoC7htQMXcY2Do1jxedc2gvJWi7dIs1DkdNPWXhrp+XY23PPcMwReyxidG9epHHrzEMmRe65gBnc1g+u8MzC25awfOqdAyOonvbs4byp6fZYcFOEPJNVxrSPGyVP/ldb3Mq7fnDdev3ZkHADx8JMPcKBQlYLLxcATTHs7aK0dYCIyLuuFXxo0JNA7OQpZlEELweluMiUB1IDXB7fZTykLgblonMPlAM1x/x3cPhBCIKYKyw2wKVLnjlKt0yRkWAt/emMt2uPWsWjBkavxxEEJw6ReRCdxk41Fu5zUuv6GWyi0dM5iW9U5LP8qgyjOTM2TOX5/E7aiEzc1s1ZtsPNY3CGAmUNpEUeWdwc3EY73ZZjLoHHqAj7sT+PraJCKChDeOsnmfQ4DVgsX5Ua+Kn8YfghCSzdqu+IrAsxawNmG+563BZA6BPZ6VE6hyxynzMVwMbrLxBQQigoQa/8pIVAdSE5wzrHhWAl5hF1AXSODCdTGHACEEEiHwXkwyE3AE0x6uPXx/bQXDKH6laQo9P0wiKRJcuSHCcS6JD31x1J6K43goiVt3pSwR92BxEmWHBbQFYy9yHMdx1n66rA2b26bw250UxBSBrSdhuGFpA4+BHydBCEFSJKg8svxx3NeVimT/ht4RatmwxHEsaZzC0K+63Ke+X76ydQd53IzoSji+WvrddYcEHD+fzr0j1g8oo0bgW1oESE+k3esr3mT9V3UVupYhu79bGi24EZ0MY/WOTqrmd/uuY7Gst45zxb29Mqar1XHB+N1tbXH1xKWHzxneC72XqXmTW9YW/89frufx+xNZx6MSKj9b2tsDpxOQCEFKItjuKpyKFgevuUPTZYbgC+EZUbaX23lt8Yc7XDHcjuok/vhTQmN/ApZPhUVVxRAYSkJM6eD2s4XVWxy8djQ0/eay4AvREZqybHXGZhdvYG4Uco6bRAjuxiTEkvrzZIrg4s8i3j5WWPm2trhatPL8aB4UV1l7pLGSgwYj1BXDJ30JuAeTaBpIYq8vbngLWndIwP5uaXRJz1nVqPGJUdZLxsKQ2deVihQctf8SzlByjSOY9lQHUhNV7jgtt/Pa+gYB6xsElNt5rcodp9WB1IQjmPZkJxxD/As65V+Aph6ZeQAAAABJRU5ErkJggg==");}';
cssStr += '.bing {  background-color: transparent;  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACwUlEQVRYhcWXz0tUURTHjwU6ixYtgtQ2tWvjOmpTrUb7A9q0CFpYgQzMPTMuIofrPW8WEonpMClIwlhYoEjEiKuRhFCjEIt0ROmXFkjiYnRMZhpOi/E56vy6772xDtzNg/u+H849957vAdANKatBehqBRAgIJ6BdLIISm6DEJrSLRSCcABIhkJ5GkLJa+7/lhVvrwcA+IEwAIWuuBBjYB8HmOgfC0gUSCZQ3aUH44FLeJEgkkNJlUdxfCwqnbQvngeA0SH+tnnhbSwMoXKmYeA5iBdpaGkqLB5vrgMRqxcX3QxTNhJQuIDFTbPOtVy/4bE+wQsdRqCYkUqmNyxvrzMz8ZuUL3x0bcQYhkQ6Jt9aXq3YTgJl550/aYRa8yYNXNHvPS26qKAAhA/l6s+LdTTWgxOa/B8BE9sWUnkadDUcAwBBAN+y+7bYATndKhxAiBEA4YRfg6cf3PPntM98ZG+ZTDwPWAQwRg91OZgvgciS89y2dyXB0aZ5vjD7jEx339AAUxkGnAIsBVJGPF9bX+HBsp1P8/NMsX3jyqHwhOgEAQvaMj+YBmNE1M6kB4OAIzCxcHXzM48tx6wAK446K0FzHDB/ffDnEG7+3rQEYIuboGgIhXxzo5rc/vts8AhGy/RCd6VI8+OFd0fMfXpjjc+W6ZwDdWbOp4ff2AzAzJ1OpgsJzaz/5SiSscw0TOfNqsRkVil/JLb4dHebjhl9HnHPNyHRCZdpx/+xMQeF0JsOd06/55IP7msJYoB1rGBIg5EsDPTy1+nVPPLo0z+fDHfrC5sozJKYl03DCVeTj6yMRvjbUb12YMGvJuptqivhCf+2ROOKceAlTasZ/teUHM1G5wYTElP5gsr8mnI5mhFvQ7lPFz1wngs11toZT8vU6G07zM1INAXQDiRAYIgYK47tQCVAYB0PEgEQIAui2Mp7/BacvWa5IAfmhAAAAAElFTkSuQmCC");}';
cssStr += '.duckduckgo {  background-color: transparent;  background-image: url("data:image/png;base64,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");}';
cssStr += '.baidu {  background-color: transparent;  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEHklEQVRYhcVX3WtbZRh/77L+Ce0IBJr3nPOetNnmhsxOu05bk9LKqrCxoTCQyYZC6dhuRlGH65WIDCHi6sfwRrxw9cYxZ7WxA3UdvRiszXlPPpulWYv9iknTNG2SnxdZsp7knJO0nfiDBw7v1+85z/s87/M8hNSNgMXmmHYLIvfYJcXbLCkqZUqKMiXVLCmqXVK8gsg9Nse0m5CApf5za0AQHuxtlnzDRTKO+kRJNUu+YauVN+2COtZAmW/ILvG1+om1UtzrGyIk1rAtasYmGynjEzsl1pEJxiYb6yIXxYdOKvHZZ0heFInPiuJDpym51cqbqKTEzQ46cSqKG98u48zbjzTjrFXF8TcikFpUUyVMLBFroCK/b0be5Q4jmy0AAPJ54OTpKCjjeKkjiJloFgAw5k2ZK8H4hK5PUOYbqmXGz79YxFaM/JgAZRyjv6Y04+/1x2tciW9IQy4ID/bW4+03RxIaoj/+TIO1qsjlNMP4+JO/a0aHJkSLca6/mLWqEB3F70+vLWiIvvt+BQef96MSFy49ru2UsnqdEEKIzebdQ5myqrfo/LuzSCbzSPyTw9lzMbS1B7G8XPzdtbU83D1hUMbB+XqZfCaaRct+Ux94IkqKkICF2BzTbr0FslPF4tJT266s5LDvoB8dnSFcuTpfJqeMo7s3jPG7q7h1O4mOzhDajwXx5ddL6B+Il62nfxVTLiKI3KM32d0brjJtZejpiWOfitn4RnnPNzeWDdcKIvcQu6R49SY7XdUKnD0X08xfHpzDhUuPsf+Qvzz+zvmYZs/GRsHwSgRZGSPFrKY3yREKZcsHbW4W8MKLQVDGMXAxXn4PACAQzOLoyyFQxnF5cK5K8Z7jEYOHSeHELMu9fmIGc/ObyGQKuPLRPCjjeOvMo6qwAwDO1+F8zo9Tb0Y147kccOhwwNgRa6VZQS46JGUcXd1hLCxuVrM/wc93khBkjp9uJQEAhQJw7bMF80gwuoJK6e2LaKLCCDdHEpBaOF55NYS29qD5uZLCDZ1wq7zWF0EiUZu8hF9Ga+aDp05oFIYlcfeEsVTHn1fih5FEbQVE7jF8iEry1730tslLeP/DeVMF7NKUixASsJg5YiZTqM1kgN/HV80dsFS8miWjra/adjH6W8pYgVIyKlVCRul4+KulHSsw+MGcgekr0rFZQeI84Mf43VUUttxEOp1HJJLFxP00VHUda5l8FfntO0mwVqNIqChIyiWZSSV8+EgAx7pCcB7wV80JMkdbexAnT0fRPxBHb18EgmzofBM2m3ePblXI2GTjf1IRlx8e06K0iP+1LNdY4pk2Jr57dTcmWp/YZWvGlDRlvquGd14PrFbetJPmlMrq9V02p5UIWOzSlEsQuUeQlTEqKbzUnlNJ4YKsjBVb9ynXdtrzfwEP/HiZPsfCUAAAAABJRU5ErkJggg==");}';
cssStr += '.search {  background-color: transparent;  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABoklEQVRYhe2WzUosMRCFM+j+jpthHqdXF/f+rBQEFwOuRH2AgLs01DmVhoZ5ARf9DsLovI5Mv4Cau0mguTj3TpP2Z9EHsqvK+VJVnbQxo0aN2lF1XR8AuFPVtaq2qvqmqi2AZ5K31trpp5kDuFDV1nsfti2SGwDng5uLyH0yAfBI8qgsy1nTNHtlWc4AHKvqqhNjBzMHcBFP90ryMoQw+SguhDAhuSD5GuPPss3ruj5IZSd5uUsOyUVqR/ZMALhLZd928r8VQpio6lPMu8kCUNV1PM1Rn7yqqk6890FVV7kArfc+lGU565PnnJunNuQCvHnvQ9M0e33yiqLYjwDvuQBZFVDVNgsAwHMcpuM+eSJyOsgMkLxNG/X8CtYR/DoLwFo7JbmJ/VzsCH0V41+Wy+WvLABjjAFw3rkJF/+5Ca/S4AJ4yDbvQNh0z6vqU1VVJ865eVEU+865uYicprJ316BvAsmz1I5/vIYvAB4+DcJaOwVwo6orkhuS7/G/YAXgOvW8W7HBIXbVCLENQkQOvxVCRH5/OYAxxojI4beZj/rx+gPBiLDGATeGXAAAAABJRU5ErkJggg==");}';
cssStr = '<style type="text/css">' + cssStr + '</style>';

$(cssStr).insertAfter($styleBody);

var mainHtmlStr, $main,
    searchBarHtmlStr, $searchBar,
    $menuModal;

mainHtmlStr = '<div class="container"><button type="button" class="btn btn-default my-btn-circle" data-toggle="modal" data-target="#menu-context"><i class="icon menu"></i></button><div class="modal fade" id="menu-context"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">设置</h4></div><div class="modal-body" style="padding: 15px;"><div class="my-mb" id="o1"><div class="row"><div class="col-sm-8"><h4 style="margin: 0; height:100%; line-height:200%;">1. 搜索框</h4></div><div class="col-sm-4"><div class="btn-group dropright"><button type="button" class="btn btn-primary" id="search-bar-btn">关闭</button><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#">关闭</a></li><li><a href="#">打开</a></li></ul></div></div></div></div><div class="my-mb" id="o2"><div class="row"><div class="col-sm-8"><h4 style="margin: 0; height:100%; line-height:200%;">2. 更换背景</h4></div><div class="col-sm-4"><div class="btn-group dropright"><button type="button" class="btn btn-primary" id="bg-btn">关闭</button><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#">关闭</a></li><li><a href="#">打开</a></li></ul></div></div></div></div><div class="my-mb" id="o3"><div class="row"><div class="col-sm-12"><h4>3. 备份与恢复</h4></div></div><div class="row"><div class="col-sm-7"><div class="input-group my-input-file" name="filename"><input type="text" class="form-control" placeholder="选择文件..." disabled><span class="input-group-btn"><button type="button" class="btn btn-danger" disabled>取消</button></span></div></div><div class="col-sm-1"></div><div class="col-sm-4"><button type="button" class="btn btn-primary" id="file-btn" data-sign="0">导出</button></div></div></div></div></div></div></div></div>';
searchBarHtmlStr = '<form class="input-group" id="search-bar" method="get" target="_blank" action="https://www.google.com/search"><div class="input-group-btn"><button type="button" class="btn btn-lg" id="my-btn-search1"><i class="icon google"></i></button><button type="button" class="btn dropdown-toggle" id="my-btn-search2" data-toggle="dropdown"><span class="caret"></span></button><div class="dropdown-menu dropdown-menu-right"><i class="drop-item icon duckduckgo" id="duckduckgo"></i><i class="drop-item icon baidu" id="baidu"></i><i class="drop-item icon bing" id="bing"></i><i class="drop-item icon google" id="google"></i></div></div><input type="text" class="form-control input-lg" autocomplete="off" placeholder="搜索" name="q"><div class="input-group-btn"><button type="button" class="btn btn-lg" id="my-btn-search3"><i class="icon search"></i></button></div></form>';
$main = $(mainHtmlStr);
$searchBar = $(searchBarHtmlStr);
$menuModal = $main.find("#menu-context");
$body.append($main);


// search bar
var engineConfig = {
  google: {
      name: "q",
      action: "https://www.google.com/search"
  },
  bing: {
      name: "q",
      action: "https://cn.bing.com/search"
  },
  duckduckgo: {
      name: "q",
      action: "https://duckduckgo.com/"
  },
  baidu: {
      name: "wd",
      action: "https://www.baidu.com/s"
  }
};

var $engineWrapper = $searchBar.find(".dropdown-menu"),
    $engineIcon = $searchBar.find("#my-btn-search1 i"),
    $inputField = $searchBar.find("input[type='text']"),
    $submitBtn = $searchBar.find("#my-btn-search3");

$engineWrapper.on("click", function (evt) {
    var clickedItemName = $(evt.target).attr("id"),
        config = JSON.parse(localStorage.getItem("GLOBAL")) || globalConfig;

    if (!clickedItemName && !config["isSearchBarOpen"]) {
        return ;
    }
    $searchBar.attr("action", engineConfig[clickedItemName]["action"]);
    $inputField.attr("name", engineConfig[clickedItemName]["name"]);
    $engineIcon.attr("class", "icon "+clickedItemName);
    config["searchEngine"] = clickedItemName;
    localStorage.setItem("GLOBAL", JSON.stringify(config));
});

$inputField.on("focus", function (evt) {
    $(this).on("keydown", function (evt) {
        evt.stopPropagation();
    });
});

$submitBtn.on("click", function  (evt) {
    if (!$inputField.val()) {
        return ;
    }
    $searchBar.trigger("submit");
});

var $searchBarBtn = $("#o1 #search-bar-btn");

$("#o1 .dropdown-menu").on("click", function (evt) {
    var sign = $(evt.target).text() === "打开" ? 1 : 0,
        config = JSON.parse(localStorage.getItem("GLOBAL")) || globalConfig;

    $searchBarBtn.text($(evt.target).text());
    config["isSearchBarOpen"] = sign;
    if (sign) {
        $searchBar.insertAfter($body.find(".content .navbar .navbar-header"));
    }  else {
        $searchBar.detach();
        config["searchEngine"] = "google";
    }
    localStorage.setItem("GLOBAL", JSON.stringify(config));
});


// change background
var $bgBtn = $("#o2 #bg-btn");

$("#o2 .dropdown-menu").on("click", function (evt) {
    var sign = $(evt.target).text() === "打开" ? 1 : 0,
        config = JSON.parse(localStorage.getItem("GLOBAL")) || globalConfig;;

    $bgBtn.text($(evt.target).text());
    config["isBgSet"] = sign;
    if (sign) {
        $(".input-ghost", $menuModal).one("change", function (evt) {
            var fr = new FileReader(),
                file = $(this).prop("files")[0];

            $textInput.val("");
            if (!/image*/.test(file.type)) {
                console.error("ERROR! Please select an image!");
                config["isBgSet"] = 0;
                $bgBtn.text("关闭");
                localStorage.setItem("GLOBAL", JSON.stringify(config));
                return ;
            }
            fr.onload = function (evt) {
                $body.css("backgroundImage", 'url("'+fr.result+'")');
                config["bgData"] = fr.result;
                localStorage.setItem("GLOBAL", JSON.stringify(config));
            };

            fr.readAsDataURL(file);
        });
        $(".input-ghost", $menuModal).trigger("click");
    }  else {
        $body.css("background-image", 'url("https://qianshan.sfo2.digitaloceanspaces.com/mountain.jpg")');
        config["bgData"] = "";
        localStorage.setItem("GLOBAL", JSON.stringify(config));
    }
});


// backup and restore
var $myInputFileDiv = $("#o3 .my-input-file"),
    $textInput = $myInputFileDiv.find("input[type='text']"),
    $clearBtn = $myInputFileDiv.find("button.btn-danger"),
    $fileBtn = $("#o3 #file-btn");

function createInputFileGhost() {
    var $newIF = $("<input type='file' class='input-ghost' style='display: none;'>");

    if ($menuModal.find(".input-ghost").length) {
        return ;
    }
    $newIF.attr("name", $myInputFileDiv.attr("name"));
    $newIF.on("change", function (evt) {
        $textInput.val($newIF.val().split("\\").pop());
    });
    $textInput.css("cursor", "pointer");
    $textInput.on("click", function (evt) {
        $newIF.click();
    });
    $clearBtn.on("click", function (evt) {
        $newIF.val("");
        $textInput.val("");
    });
    return $newIF;
}

$myInputFileDiv.on("mouseover", function (evt) {
    $textInput.removeAttr('disabled');
    $clearBtn.removeAttr('disabled');
    $fileBtn.text("导入");
    $fileBtn.attr("data-sign", "1");
});

$myInputFileDiv.on("mouseout", function (evt) {
    if ($textInput.val()) {
        return ;
    }
    $(".input-ghost", $menuModal).val("");
    $textInput.attr('disabled','disabled');
    $clearBtn.attr('disabled','disabled');
    $fileBtn.text("导出");
    $fileBtn.attr("data-sign", "0");
});

function getConfig(block) {
    var $block = $(block),
        $grids = $("div.website", $block),
        ret = {},
        configOfAllGrids = [],
        i;

    ret["title"] = $("div.block-name", $block).text().trim();
    for (i = 0; i < $grids.length; i++) {
        var siteObj = {};

        siteObj["name"] = $("a span", $grids[i]).text();
        siteObj["href"] = $("a", $grids[i]).attr("href");
        configOfAllGrids.push(siteObj);
    }
    ret["websites"] = configOfAllGrids;
    return ret;
}

function setConfig(block, configObj) {
    var $block = $(block),
        $grids = $("div.website", $block),
        webs = configObj["websites"],
        blockId = $block.parent().index() + 1 + "",
        categoryInStorage = JSON.parse(localStorage.getItem(blockId)) || {},
        $website, websiteInStorage,
        i;

    $("div.block-name a", $block).text(configObj["title"]);
    categoryInStorage.category_id = blockId;
    categoryInStorage.category_name = configObj["title"];
    localStorage.setItem(blockId, JSON.stringify(categoryInStorage));
    for (i = 0; i < webs.length; i++) {
        $website = $($grids[i]);
        $("a span", $website).text(webs[i]["name"]);
        $("a", $website).attr("href", webs[i]["href"]);
        websiteInStorage = JSON.parse(localStorage.getItem(blockId+(i+1))) || {};
        websiteInStorage.website_id = blockId + (i + 1);
        websiteInStorage.website_name = webs[i]["name"];
        websiteInStorage.website_link = webs[i]["href"];
        websiteInStorage.website_hotkey = [];
        websiteInStorage.website_sibling_name = $website.parents('div.building').find('a.website').text();
        websiteInStorage.website_sibling_id = $website.parents('div.building').find('a.website').attr('id');
        localStorage.setItem(blockId+(i+1), JSON.stringify(websiteInStorage));
    }
}

function configJSONFileDownload(content, filename) {
    var a = "<a style='display: none;' download='" + filename +"'></a>",
        blob = new Blob([content], {type : 'application/json'}),
        $a = $(a);

    $a.attr("href", URL.createObjectURL(blob));
    $a.appendTo($menuModal);
    $a[0].click();
    $a.remove();
}

function localJSONFileHandler(file) {
    var tempFR = new FileReader();

    return new Promise(function (resolve, reject) {
        tempFR.onload = function () {
            resolve(this.result);
        };
        tempFR.onerror = function () {
            tempFR.abort();
            reject(new Error("Problem parsing input file!"));
        };
        tempFR.readAsText(file);
    });
}

$fileBtn.on("click", function (evt) {
    var sign = +$(this).attr("data-sign"),
        $blocks = $("div.building"),
        configJSON, configOfAllBlocks, now,
        fileContent, filename,
        localFile;

    if (!$blocks.length) {
        console.error("ERROR! Please use this script at http://qianshan.co!");
        return ;
    }
    if (sign) {
        localFile = $(".input-ghost", $menuModal).prop("files")[0];
        localJSONFileHandler(localFile).then(function (json) {
            json = JSON.parse(json);
            if (!json["data"] || !json["config"]) {
                console.error("ERROR! JSON file content is incorrect!");
            }
            json = json["config"];
            $blocks.each(function (index, element) {
                setConfig(element, json[index]);
            });
            console.log("the import operation succeeded.");
        }, function (error) {
            console.error("ERROR!", error);
        });
    } else {
        configOfAllBlocks = [];
        configJSON = {};
        now = new Date();
        $blocks.each(function (index, element) {
            configOfAllBlocks.push(getConfig(element));
        });
        configJSON["data"] = now.toLocaleString();
        configJSON["config"] = configOfAllBlocks;
        fileContent = JSON.stringify(configJSON, null, 4);
        filename = "qianshan-config-" + now.getUTCFullYear() + "-"
                   + (now.getUTCMonth()+1) + "-"
                   + now.getUTCDate() + ".json";
        configJSONFileDownload(fileContent, filename);
        console.log("the export operation succeeded.");
    }
});

$menuModal.on("hidden.bs.modal", function (evt) {
    $(".input-ghost", $menuModal).val("");
    $textInput.val("");
    $textInput.attr('disabled','disabled');
    $clearBtn.attr('disabled','disabled');
    $fileBtn.text("导出");
    $fileBtn.attr("data-sign", "0");
});


//global config
var globalConfig = {
    "isSearchBarOpen": 0,        // 0 means off, 1 means on
    "searchEngine": "google",    // google is the default search engine
    "isBgSet": 0,                // 0 means no setting, 1 means setting
    "bgData": ""
};

$(function () {
    var config = localStorage.getItem("GLOBAL");

    $menuModal.append(function (index, html) {
        return createInputFileGhost();
    });
    $(".input-ghost", $menuModal).val("");
    $textInput.val("");
    if (!config) {
        return ;
    }
    config = JSON.parse(config);
    if (config["isSearchBarOpen"]) {
        $searchBarBtn.text("打开");
        $searchBar.attr("action", engineConfig[config["searchEngine"]]["action"]);
        $inputField.attr("name", engineConfig[config["searchEngine"]]["name"]);
        $engineIcon.attr("class", "icon "+config["searchEngine"]);
        $searchBar.insertAfter($body.find(".content .navbar .navbar-header"));
    }
    if (config["isBgSet"]) {
        $bgBtn.text("打开");
        $body.css("backgroundImage", "url("+config["bgData"]+")");
    }
});

})();
