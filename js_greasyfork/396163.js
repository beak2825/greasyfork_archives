// ==UserScript==
// @name         反黑反黑！
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Only for LX!
// @author       Chinshry
// @include      https://m.weibo.cn/detail/*
// @include      https://m.weibo.cn/status/*
// @include      https://service.account.weibo.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/396163/%E5%8F%8D%E9%BB%91%E5%8F%8D%E9%BB%91%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/396163/%E5%8F%8D%E9%BB%91%E5%8F%8D%E9%BB%91%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    /* 判断是否该执行 */
    const whiteList = ['m.weibo.cn/detail','m.weibo.cn/status','service.account.weibo.com/reportspamobile'];
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const indexPath = pathname.substr(1).indexOf('/')
    const projectName = (indexPath == -1) ? pathname : pathname.substring(0, indexPath + 1);
    const finalName = hostname + projectName;

    const thispath = whiteList.indexOf(finalName);
    if (thispath < 0){
      console.log("Not WhiteList 2");
      return;
    }

    function init() {
        const scriptjquery = document.createElement('script');
        scriptjquery.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js';
        document.head.appendChild(scriptjquery);
        const scriptToastr = document.createElement('script');
        scriptToastr.src = 'https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.js';
        document.head.appendChild(scriptToastr);
    }

    function initCSS() {
        const scripCSS = document.createElement('link');
        scripCSS.rel = 'stylesheet';
        scripCSS.href = 'https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css';
        document.head.appendChild(scripCSS);
    }

    initCSS();
    try {
        toastr.options = {
            timeOut: "10000",
        };
    } catch (e) {
        console.log("INIT")
        init();
    }

    console.log("READY")

    setTimeout(function () {

        console.log("START")

        try {
            toastr.options = {
                timeOut: "10000",
            };
            toastr.info("初始化");
        } catch (e) {
            console.log(e)
            alert("请刷新重试")
            return
        }

        var ok = 0
        var fail = 0
        var repeat = 0
        var inexistence = 0
        var outdate = 0
        var other = 0
        var num = 0

        var typeMap = new Map();
        typeMap.set("垃圾-认证", {tip: "垃圾营销-卖粉丝认证", type: 101})
        typeMap.set("垃圾-认证", {tip: "垃圾营销-卖粉丝认证", type: 101})
        typeMap.set("垃圾-@", {tip: "垃圾营销-广告信息@我", type: 102})
        typeMap.set("垃圾-用户", {tip: "垃圾营销-广告用户关注我", type: 103})
        typeMap.set("垃圾-头像", {tip: "垃圾营销-头像垃圾内容", type: 104})
        typeMap.set("垃圾-简介", {tip: "垃圾营销-昵称简介广告", type: 105})
        typeMap.set("垃圾-信息", {tip: "垃圾营销-广告信息", type: 106})
        typeMap.set("垃圾-广告", {tip: "垃圾营销-昵称头像广告", type: 107})
        typeMap.set("垃圾-其他", {tip: "垃圾营销-其他广告", type: 108})
        typeMap.set("涉h-低俗", {tip: "涉黄信息-低俗信息", type: 202})
        typeMap.set("涉h-s情", {tip: "涉黄信息-色情图文", type: 204})
        typeMap.set("涉h-昵称", {tip: "涉黄信息-头像昵称违规", type: 207})
        typeMap.set("不实-不在", {tip: "不实信息-不在以上分类", type: 504})
        typeMap.set("人身-人身攻击", {tip: "人身攻击-人身攻击我", type: 601})
        typeMap.set("有害-bk", {tip: "有害信息-暴恐血腥", type: 801})
        typeMap.set("有害-其他", {tip: "有害信息-其他有害信息", type: 804})
        typeMap.set("违f-售m", {tip: "违法信息-售卖个人信息", type: 1507})

        var linkAll = [];
        var nowhost = window.location.host;
        console.log(nowhost);
        whatPage(nowhost);

        function whatPage(nowhost){
            if (nowhost == "service.account.weibo.com") {
                $('#toast-container').css("font-size","medium");
                var search = window.location.search;
                var links = getSearchString('mylinks', search);
                num = links.length
                console.log(links)
                toastr.warning("跳转成功 共" + num + "条待反黑")
                for (var i = 0; i < links.length; i++) {
                    var type = getSearchStringForList('pos', links[i]);
                    getData(type, links[i]);
                }
                if(num == ok + fail + repeat + inexistence + outdate + other){
                    console.log('=========================OVER===========================')
                    if (fail != 0) toastr.error(fail + "条反黑失败 刷新重试");
                    if (ok != 0) toastr.info(ok + "条反黑成功");
                    if (repeat != 0) toastr.info(repeat + "条反黑重复");
                    if (inexistence != 0) toastr.info(inexistence + "条已不存在");
                    if (outdate != 0) toastr.info(outdate + "条已过追溯期");
                    toastr.success("反黑完成！！");
                }
            } else {
                getList();
            }
        }

        function sleep(d){
          for(var t = Date.now();Date.now() - t <= d;);
        }

        function getSearchString(key, Url) {
            var str = Url;
            str = str.substring(1, str.length);
            var arr = str.split("&");
            var obj = new Object();
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=")
                var tmp_arr_emp_list = [];
                var tmp_arr_emp = decodeURIComponent(tmp_arr[1]).split(",");
                for (var j = 0; j < tmp_arr_emp.length; j++) {
                    tmp_arr_emp_list.push(tmp_arr_emp[j])
                }
                obj[decodeURIComponent(tmp_arr[0])] = tmp_arr_emp_list;
            }
            return obj[key];
        }

        function getSearchStringForList(key, Url) {
            var str = Url;
            var arr = str.split("&");
            var obj = new Object();
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }

        function getRedirectLink(link, linkType) {
            $.getJSON({
                url: "https://tenapi.cn/dwzrec/?url=" + link,
                async:false,
                success: function (result) {
                    if(result.hasOwnProperty("rec")){
                        var url = result.rec;
                        if (url.search("service") != -1 && url.search("myexposures") == -1){
                            linkAll.push({link: url, type: linkType})
                        }
                    }
                },
                error: function (err) {
                    console.log("错误 " + err);
                }
            });
        }

        function getList() {
            var lxuid = document.getElementsByTagName('h3');
            var fhz = lxuid[0].parentNode.href.search("7380319265");
            var lx = (fhz != -1)
            if (lx) {
                console.log("LX")
                var textclass = document.getElementsByClassName("weibo-text");
                var textInner = textclass[0].innerHTML;
                textInner = textInner.replace(/&amp;/g,"&")
                // console.log(textInner)
                var html = getWeiboText(textInner);
                var a = html.getElementsByTagName('a');
                var types = getTypes(textInner)
                console.log(types)
                var links = []
                var linkPos = 0
                for (var i = 0; i < a.length; i++) {
                    var temp = a[i].href
                    linkPos = textInner.indexOf(temp, linkPos + 1)
                    if (linkPos < types[0].pos) {
                        continue
                    }

                    var linkType
                    for(var j = types.length - 1; j >= 0; j--){
                        if(linkPos > types[j].pos){
                            linkType = types[j].type
                            break
                        }
                    }
                    if (temp.search("service") != -1 && temp.search("myexposures") == -1) {
                        if(a[i].nextSibling.textContent != ""){
                            temp = temp+a[i].nextSibling.textContent
                        }
                        linkAll.push({link: temp, type: linkType})
                    } else if (temp.search("A6hhEl6C") == -1 && temp.search("A6yZSV0U") == -1 &&
                                temp.search("RpEdfxU") == -1 && temp.search("A6Pi4nmM") == -1){
                        getRedirectLink(temp, linkType)
                    }
                }

                for (var n =0; n < linkAll.length; n++){
                    var search = linkAll[n].link.split('?')[1]
                    var rid = getSearchStringForList("rid",search)
                    var type = getSearchStringForList("type",search)
                    var formenLink = "rid=" + rid + "&type=" + type;
                    console.log(formenLink, linkAll[n].type);
                    var eachLink = formenLink + '&pos=' + linkAll[n].type
                    links.push(eachLink.replace(/（已咔掉）/g,"").replace(/（博文已咔掉）/g,""))
                }

                var lxurl = "https://service.account.weibo.com/reportspamobile?" + links[0] + "&from=40000" + "&mylinks=" + escape(links);
                console.log(lxurl)
                toastr.success("共" + links.length + "条待反黑 即将跳转")
                setTimeout(function () {
                    window.open(lxurl,'_self')
                }, 1000)
            } else {
                console.log("NOT LX")
                toastr.error("非反黑站微博")
            }
        }

        function getTypes(textInner) {
            var types = []
            typeMap.forEach((value, key) => {
                var pos = textInner.indexOf(key)
                while(pos > -1) {
                    toastr.warning(value.tip)
                    types.push({pos: pos, type: value.type});
                    pos = textInner.indexOf(key, pos + 1);
                }
            });
            var sortTypes = types.sort(function(a,b){
                return ((a.pos<b.pos)?-1:(a.pos>b.pos)?1:0)
            })
            return sortTypes
        }

        function getWeiboText(textInner) {
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(textInner, "text/html");
            return htmlDoc
        }

        function getData(type, url) {
            $.ajax({
                type: 'GET',
                url: "https://service.account.weibo.com/reportspamobile?" + url + "&from=40000",
                async:false,
                success: function (response) {
                    var text = response;
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(text, "text/html");
                    var extraData = htmlDoc.getElementById('extra_data').value;
                    var category = type.toString().slice(0, -2);
                    var data
                    var rsReson
                    if (type == 601) {
                        rsReson = "&extra=%E8%AF%A5%E7%94%A8%E6%88%B7%E6%81%B6%E6%84%8F%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%E8%89%BA%E4%BA%BA%E6%9D%8E%E7%8E%B0%EF%BC%8C%E6%8D%8F%E9%80%A0%E6%95%A3%E5%B8%83%E8%99%9A%E5%81%87%E6%B6%88%E6%81%AF%EF%BC%8C%E8%BF%9B%E8%A1%8C%E6%81%B6%E6%84%8F%E8%BE%B1%E9%AA%82%E3%80%81%E7%94%A8%E8%AF%8D%E7%9B%B8%E5%BD%93%E6%81%B6%E5%8A%A3%EF%BC%8C%E5%AF%B9%E6%9D%8E%E7%8E%B0%E4%B8%AA%E4%BA%BA%E5%90%8D%E8%AA%89%E9%80%A0%E6%88%90%E9%9D%9E%E5%B8%B8%E6%81%B6%E5%8A%A3%E7%9A%84%E5%BD%B1%E5%93%8D%EF%BC%8C%E5%BE%AE%E5%8D%9A%E6%98%AF%E4%B8%80%E4%B8%AA%E5%A4%A7%E4%BC%97%E5%8C%96%E7%9A%84%E5%B9%B3%E5%8F%B0%E6%9C%89%E7%9D%80%E5%B9%BF%E5%A4%A7%E7%9A%84%E5%BD%B1%E5%93%8D%E5%8A%9B%EF%BC%8C%E5%AF%B9%E4%BA%8E%E6%81%B6%E6%84%8F%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%E8%AF%B7%E5%8A%A1%E5%BF%85%E4%B8%A5%E8%82%83%E5%A4%84%E7%90%86%EF%BC%8C%E8%B0%A2%E8%B0%A2%E3%80%82"
                        data = "category=" + category + "&tag_id=" + type + "&" + extraData + rsReson + "&appGet=0&weiboGet=0&blackUser=1&_t=0";
                    } else if (type == 504) {
                        rsReson = "&extra=%E6%AD%A4%E5%BE%AE%E5%8D%9A%E6%8D%8F%E9%80%A0%E4%B8%8D%E5%AE%9E%E4%BF%A1%E6%81%AF%EF%BC%8C%E6%81%B6%E6%84%8F%E6%95%A3%E5%B8%83%EF%BC%8C%E6%89%AD%E6%9B%B2%E4%BA%8B%E5%AE%9E%EF%BC%8C%E5%AF%B9%E8%89%BA%E4%BA%BA%E8%BF%9B%E8%A1%8C%E4%BA%BA%E8%BA%AB%E6%94%BB%E5%87%BB%EF%BC%8C%E9%80%A0%E6%88%90%E4%BA%86%E6%81%B6%E5%8A%A3%E5%BD%B1%E5%93%8D%EF%BC%8C%E4%B8%A5%E9%87%8D%E4%BE%B5%E7%8A%AF%E4%BA%86%E8%89%BA%E4%BA%BA%E7%9A%84%E5%90%8D%E8%AA%89%E6%9D%83%E3%80%82%E5%90%8C%E6%97%B6%E8%AF%A5%E7%94%A8%E6%88%B7%E7%9A%84%E4%BD%8E%E4%BF%97%E8%A8%80%E8%AE%BA%E4%B8%A5%E9%87%8D%E5%8D%B1%E5%AE%B3%E6%9C%AA%E6%88%90%E5%B9%B4%E7%BD%91%E5%8F%8B%E8%BA%AB%E5%BF%83%E5%81%A5%E5%BA%B7%EF%BC%8C%E4%B8%A5%E9%87%8D%E8%BF%9D%E5%8F%8D%E4%BA%86%E3%80%8A%E5%BE%AE%E5%8D%9A%E7%A4%BE%E5%8C%BA%E7%AE%A1%E7%90%86%E8%A7%84%E5%AE%9A(%E8%AF%95%E8%A1%8C)%E3%80%8B%EF%BC%8C%E4%B8%A5%E9%87%8D%E7%A0%B4%E5%9D%8F%E7%BD%91%E7%BB%9C%E6%B2%BB%E5%AE%89%E7%8E%AF%E5%A2%83%E3%80%82%E8%AF%B7%E5%B0%BD%E5%BF%AB%E4%B8%A5%E8%82%83%E5%A4%84%E7%90%86%EF%BC%8C%E8%B0%A2%E8%B0%A2%E3%80%82"
                        data = "category=" + category + "&tag_id=" + type + "&" + extraData + rsReson + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
                    } else {
                        data = "category=" + category + "&tag_id=" + type + "&" + extraData + "&appGet=0&weiboGet=0&blackUser=0&_t=0";
                    }
                    console.log('成功获得链接 | ' + ' 举报类型 = ' + type + '\n' + url)
                    report(data);
                },
                error: function (err) {
                    toastr.error("错误 " + err);
                    console.log("错误 " + err);
                }
            });
        }

        function report(data) {
            var timestamp = (new Date()).valueOf();
            var url = "https://service.account.weibo.com/aj/reportspamobile?__rnd=" + timestamp;
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                async:false,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest"
                },
                success: function (response) {
                    var code = JSON.parse(response).code;
                    if (code == 100000) {
                        ok++
                    } else if (code == 100003) {
                        repeat++
                    } else if (code == 100009) {
                        inexistence++
                    } else if (code == 100008) {
                        outdate++
                    } else if (code == 10012) {
                        fail++
                    } else {
                        other++
                    }
                    var txtRse = unescape(response.replace(/\\u/g, '%u'))
                    console.log('提交举报 ' + txtRse);
                },
                onerror: function (err) {
                    console.log("错误 " + err);
                }
            });
        }
    }, 2000)
})();
