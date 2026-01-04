// ==UserScript==
// @name         Facebook Ads UTM
// @namespace    http://tampermonkey.net/
// @version      1.1.28
// @description  Facebook Ads UTM Tool For Saker!
// @author       Jimmy
// @include      *.facebook.com/adsmanager/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/moment-timezone-all@0.5.5/builds/moment-timezone-with-data.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-idle
// @connect      ycimedia.net
// @connect      openapi.ycimedia.net
// @downloadURL https://update.greasyfork.org/scripts/436001/Facebook%20Ads%20UTM.user.js
// @updateURL https://update.greasyfork.org/scripts/436001/Facebook%20Ads%20UTM.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'center', // 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    //数据操作
    let util = {
        clog(c) {
            console.log(c);
        },
        getCookie(name) {
            let arr = document.cookie.replace(/\s/g, "").split(';');
            for (let i = 0, l = arr.length; i < l; i++) {
                let tempArr = arr[i].split('=');
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
            }
            return '';
        },
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getStorage(key) {
            return localStorage.getItem(key);
        },
        setStorage(key, value) {
            return localStorage.setItem(key, value);
        },
        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            },
            popup(title,html) {
                toast.fire({title: title, icon: 'warning',html:html, showCloseButton: true,timer:60*60*60*1000});
            },
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 404) {
                            requestObj.abort();
                        }
                        resolve(res.response || res.responseText);
                    },
                    onprogress: (res) => {
                    },
                    onloadstart() {
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    };

    let siteadd = false; //页面元素是否增加的标记
    let refreshdata = false; //重新通过接口获取数据
    let tracking = false; //执行标题

    let act = util.getUrlParam('act') || ""
    console.log('act',act);

    let from = util.getStorage(act+'_from') || ""; //起始日期
    let to = util.getStorage(act+'_to') || ""; //结束日期
    let type = util.getStorage(act+'_type') || ""; //广告类型
    let siteId = util.getStorage(act+'_siteId') || ""; //站点ID
    let siteName = util.getStorage(act+'_siteName') || ""; //站点名称
    let trackBtn = util.getStorage(act+'_trackBtn') || "close"; //开关状态标记
    console.log(act+'_trackBtn',trackBtn);

    let campaignsElementClass = "._3qn7._61-0._2fyi._3qng"; //左上角广告账户选项元素
    let campaignsElementClass2 = "._8fgf._8ox0"
    let campaignsElementClass3 = ".x1gslohp.x13fj5qh"
    let dateElementClass = "._1uz0"; //右上角日期元素
    let dateElementClass2 = ".x78zum5.x1qughib"
    let dateElementClass3 = "#peTabs"
    let tableElementClass = "._219p"; //主体数据列表
    let tableElementClass2 = "tbody.om3e55n1.g4tp4svg"

    let utmdata = []; //接口数据列表

    //新增页面元素内容
    let addhtml = '<div id="sakerHtml" class="sakerHtmlElement" style="display: flex;align-items: center;">'
    addhtml += '<div class="sitelist">'
    addhtml += '<div class="dropdown">'
    addhtml += '<input type="text" placeholder="Select Shopify Site" value="'+siteName+'" id="myInput">'
    addhtml += '<div id="myDropdown" class="dropdown-content">'
    addhtml += '<a data-id="">Sample</a>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '<div class="trackon" style="display: flex;align-items: center;margin-left: 20px;">'
    addhtml += '<span class="fkloq7h8 raq0z4z6" style="margin-right: 10px;">Turn on to track:</span>'
    addhtml += '<label class="switch"><input type="checkbox" class="trackbox" '+(trackBtn=="open"?'checked="checked"':"")+'> <span class="slider round"></span> </label>'
    addhtml += '</div>'
    addhtml += '</div>'
    addhtml += '<style>'
    addhtml += ' .dropbtn { background-color: #63be09; color: white; padding: 10px 16px; font-size: 16px; border: none; cursor: pointer; } .dropbtn:hover, .dropbtn:focus { background-color: #3e8e41; } #myInput { background-size: 16px; box-sizing: border-box; background-image: url(https://www.w3schools.com/howto/searchicon.png); background-position: 14px 8px; background-repeat: no-repeat; font-size: 0.875rem; padding: 8px 20px 8px 45px; border: none; border-bottom: 1px solid #ddd;min-width:230px;  height: 36px; background-color: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 6px; box-shadow: none; color: rgba(0, 0, 0, 0.85); font-family: Roboto, Arial, sans-serif; } #myInput:focus { outline: 1px solid #ddd; } .dropdown { position: relative; display: inline-block; } .dropdown-content { display: none; position: absolute; background-color: #f6f6f6; min-width: 230px; overflow: auto; border: 1px solid #ddd; z-index: 999;max-height: 300px; border-radius: 6px; } .dropdown-content a { color: black; padding: 8px; text-decoration: none; display: block; font-size: 0.875rem; } .dropdown a:hover { background-color: #ddd; } .show { display: block; } '
    addhtml += '.switch { position: relative; display: inline-block; width: 60px; height: 34px; } .switch input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked+.slider { background-color: #2196F3; } input:focus+.slider { box-shadow: 0 0 1px #2196F3; } input:checked+.slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; } '
    addhtml += '.showbg { padding: 0 5px; background-color: #ffc107; margin-right: 10px; font-weight: bold; border-radius: 10px; }';
    addhtml += '.markcol {display:block;width: 130px;text-align: center;padding: 2px 5px;margin-bottom: 2px; margin-left: -8px;}';
    addhtml += '.show-waringing { background-color: #CB3837; color:#fff; width: 150px; margin-left: -12px; cursor: pointer;}';
    addhtml += '.overlaps-box {margin-top: 0px;}';
    addhtml += '.overlaps-item {margin-bottom: 5px;text-align: center;}';
    addhtml += '</style>';


    function track(){
        tracking = setInterval(async function(){
            //判断主体数据列表中的数据是否有变化
            let tabelElementOld = util.getStorage(act+'_tabelElement') || ""
            let tabelElement = $(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html()
            if(tabelElementOld != tabelElement){
                util.clog("tabelElement changed")
                $('span.showbg').remove();
            }

            //日期处理
            let datestr = $(dateElementClass).html();
            console.log("datestr",datestr);
            let datestrarr=[];
            let from_arr = [];
            let to_arr = [];
            let from_date,from_month,from_year,to_date,to_month,to_year,dateArr
            if(!datestr){
                datestr = $(dateElementClass2).find('.xsgj6o6 .xlyipyv.x1h4wwuj').html();
                 console.log('datestr new',datestr);
            }

            if(!datestr){
                datestr = $(dateElementClass3).find('.x1xqt7ti.x1fvot60.xk50ysn.xxio538.x1heor9g.xuxw1ft.x6ikm8r.x10wlt62.xlyipyv.x1h4wwuj.xeuugli.x1iyjqo2').html();
                 console.log('datestr new2',datestr);
            }
            if(!datestr){
                datestr = $(dateElementClass3).find('.x1vvvo52.x1fvot60.xk50ysn.xxio538.x1heor9g.xuxw1ft.x6ikm8r.x10wlt62.xlyipyv.x1h4wwuj.xeuugli.x1uvtmcs.x1iyjqo2').html();
                 console.log('datestr new3',datestr);
            }
            if(!datestr){
                datestr = $(dateElementClass3).find('.x1vvvo52.x1fvot60.xk50ysn.xxio538.x1heor9g.xuxw1ft.x6ikm8r.x10wlt62.xlyipyv.x1h4wwuj.xeuugli.x1iyjqo2').html();
                 console.log('datestr new4',datestr);
            }

//             if(typeof(datestr) == 'undefined' || !datestr){
//                  return util.message.error('右上角日期组件被FB更新而无法获取日期，请联系技术进行升级');
//             }

            if(datestr){
                console.log('datestr 1111')
                if(datestr.indexOf(":") == -1){
                    datestrarr = datestr.match("<div>(.*)&nbsp;");
                    if(datestrarr == null){
                        datestrarr = datestr.match(">(.*)&nbsp;");
                    }
                }else{
                    datestrarr = datestr.match(":(.*)&nbsp;");
                    if(!datestrarr){
                        datestrarr = datestr.match(":(.*)");
                    }
                }

                console.log('datestrarr',datestrarr);

                let datestrnew = Array.isArray(datestrarr)?$.trim(datestrarr[1]):datestr;
                 console.log('datestrnew',datestrnew);
                if(datestrnew.indexOf(" – ") == -1){
                    dateArr = datestrnew.split("-");
                    console.log("dateArr 1",dateArr)
                }else{
                    dateArr = datestrnew.split(" – ");
                    console.log("dateArr 2",dateArr)
                }
                if(dateArr.length>1){
                    dateArr[0] = dateArr[0].replace(",", "");
                    from_arr = dateArr[0].split(" ");
                    console.log('from_arr',from_arr);
                    console.log("length from_arr[0]",from_arr[0].length);
                    console.log("length from_arr[1]",from_arr[1].length);
                    console.log("length from_arr[2]",from_arr[2].length);
                    if(from_arr[0].length>2 && from_arr[1].length<3){
                        from = moment(dateArr[0], 'MMM.D.YYYY').format('YYYY-MM-DD');
                    }else if(from_arr[0].length<3 && from_arr[1].length>2){
                        from = moment(dateArr[0], 'D.MMM.YYYY').format('YYYY-MM-DD');
                    }else{
                        from = moment(dateArr[0]).format('YYYY-MM-DD');
                    }

                    dateArr[1] = dateArr[1].replace(",", "");
                    to_arr = dateArr[1].split(" ");
                    if(to_arr[0].length>2 && to_arr[1].length<3){
                        to = moment(dateArr[1], 'MMM.D.YYYY').format('YYYY-MM-DD');
                    }else if(to_arr[0].length<3 && to_arr[1].length>2){
                        to = moment(dateArr[1], 'D.MMM.YYYY').format('YYYY-MM-DD');
                    }else{
                        to = moment(dateArr[1]).format('YYYY-MM-DD');
                    }
                }else{
                    let dateArrNew = dateArr[0].toLowerCase()

                    let timezone_offset_hours_utc = "";
                    let timezone_name = "";
                    if(typeof __preloaderData != 'undefined'){
                        if(typeof __preloaderData["AdsAccountDataLoaderPreloader"] != 'undefined'){
                            let fbdatastr = __preloaderData["AdsAccountDataLoaderPreloader"][0]
                            // console.log("fbdatastr",fbdatastr)
                            for (var key in fbdatastr) {
                                if (fbdatastr.hasOwnProperty(key)) {
                                    timezone_offset_hours_utc = fbdatastr[key].timezone_offset_hours_utc
                                    timezone_name = fbdatastr[key].timezone_name
                                    console.log("timezone_offset_hours_utc",timezone_offset_hours_utc)
                                    console.log("timezone_name",timezone_name)
                                }
                            }
                        }
                    }

                    var fbtoday = moment();
                    switch(dateArrNew){
                        case "today":
                            console.log('today');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).format('YYYY-MM-DD')
//                                 from = fbtoday.utcOffset(timezone_offset_hours_utc*60).clone().format('YYYY-MM-DD')
                            }else{
                                from = fbtoday.clone().format('YYYY-MM-DD')
                            }
                            to = "";
                            break;
                        case "yesterday":
                            console.log('yesterday');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).subtract(1, 'days').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().subtract(1, 'days').format('YYYY-MM-DD');
                            }
                            to = "";
                            break;
                        case 'last 7 days':
                            console.log('last 7 days');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).subtract(7, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).subtract(1, 'days').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().subtract(7, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().subtract(1, 'days').format('YYYY-MM-DD');
                            }
                            break;
                        case 'last 14 days':
                            console.log('last 14 days');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).subtract(14, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).subtract(1, 'days').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().subtract(14, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().subtract(1, 'days').format('YYYY-MM-DD');
                            }
                            break;
                        case 'last 30 days':
                            console.log('last 30 days');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).subtract(30, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).subtract(1, 'days').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().subtract(30, 'days').format('YYYY-MM-DD');
                                to = fbtoday.clone().subtract(1, 'days').format('YYYY-MM-DD');
                            }
                            break;
                        case 'this week':
                            console.log('this week');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).startOf('week').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).endOf('week').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().startOf('week').format('YYYY-MM-DD');
                                to = fbtoday.clone().endOf('week').format('YYYY-MM-DD');
                            }
                            break;
                        case 'last week':
                            console.log('last week');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).startOf('week').subtract(1, 'week').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).endOf('week').subtract(1, 'week').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().startOf('week').subtract(1, 'week').format('YYYY-MM-DD');
                                to = fbtoday.clone().endOf('week').subtract(1, 'week').format('YYYY-MM-DD');
                            }
                            break;
                        case 'this month':
                            console.log('this month');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).startOf('month').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).endOf('month').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().startOf('month').format('YYYY-MM-DD');
                                to = fbtoday.clone().endOf('month').format('YYYY-MM-DD');
                            }
                            break;
                        case 'last month':
                            console.log('last month');
                            if(timezone_name){
                                from = fbtoday.clone().tz(timezone_name).startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
                                to = fbtoday.clone().tz(timezone_name).endOf('month').subtract(1, 'month').format('YYYY-MM-DD');
                            }else{
                                from = fbtoday.clone().startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
                                to = fbtoday.clone().endOf('month').subtract(1, 'month').format('YYYY-MM-DD');
                            }
                            break;
                        case 'maximum':
                            console.log('maximum');
                            from = "";
                            to = "";
                            break;
                        default:
                            console.log('dateArrNew default');
                            dateArr[0] = dateArr[0].replace(",", "");
                            from_arr = dateArr[0].split(" ");
                            console.log('from_arr',from_arr);
                            console.log("length from_arr[0]",from_arr[0].length);
                            console.log("length from_arr[1]",from_arr[1].length);
                            console.log("length from_arr[2]",from_arr[2].length);
                            if(from_arr[0].length>2 && from_arr[1].length<3){
                                from = moment(dateArr[0], 'MMM.D.YYYY').format('YYYY-MM-DD');
                            }else if(from_arr[0].length<3 && from_arr[1].length>2){
                                from = moment(dateArr[0], 'D.MMM.YYYY').format('YYYY-MM-DD');
                            }else{
                                from = moment(dateArr[0]).format('YYYY-MM-DD');
                            }
                            to = "";
                            break;
                    }
                }
            }

            console.log('获取最终from',from)
            console.log('获取最终to',to)
            if(!from){
                return util.message.error('Unable to obtain the date range.');
            }

            let fromOld = util.getStorage(act+'_from')
            let toOld = util.getStorage(act+'_to')
            if(fromOld != from || toOld != to){
                util.setStorage(act+'_from',from)
                util.setStorage(act+'_to',to)
                refreshdata = false
            }

            //Tab处理
            let pageURL = $(location).attr("href");
            let urlarr = pageURL.match("manage/(.*)[\?]act=");
            type = $.trim(urlarr[1]);
            let typeOld = util.getStorage(act+'_type')
            if(typeOld != type){
                util.setStorage(act+'_type',type)
                refreshdata = false
            }

            console.log("type",type)
            console.log("from",from)
            console.log("to",to)
            console.log("siteid",siteId)

            var fromnew, tonew, daybetween
            fromnew = from
            if(!to){
                tonew = fromnew //moment().format("YYYY-MM-DD");
            }else{
                tonew = to
            }
            daybetween = moment(tonew).diff(moment(from),'days');
            console.log("daybetween",daybetween);
            if(daybetween>31){
                return util.message.error('The time period should not exceed 1 months');
            }


            //获取数据
            if(type && from && siteId){
                if(!refreshdata){
                    let formData = new FormData();
                    formData.append('type', type);
                    formData.append('from', from);
                    formData.append('to', to);
                    formData.append('siteid', siteId);
                    formData.append('adPlatform', 1);
                    //formData.append('campaignNameFlag', true);
                    let utmres = await util.post("https://openapi.ycimedia.net/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.post("https://capi.webtoolurl.com/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.post("http://192.168.1.9:8080/sak-api/facebook/utm/data",formData)
                    //let utmres = await util.get("http://localhost/ret.json")
                    if(utmres.code==1){
                        refreshdata = true
                        utmdata = utmres.data;
                    }
                }
                console.log('utmdata',utmdata);

                //获取需要使用的选项所在列的位置
                let arr = []
                let titleobj = null;
                if($("._1mmd._1mme").find("._182x:nth-child(2)").find("._1eyh._1eyi").length>0){
                    titleobj = $("._1mmd._1mme").find("._182x:nth-child(2)").find("._1eyh._1eyi");
                }
                if($("table thead.b6ax4al1.l0xfhuku").find('th.om3e55n1.ztn2w49o').length>0){
                    titleobj = $("table thead.b6ax4al1.l0xfhuku").find('th.fmto4xm6.kwxi6gwq');
                }

                console.log('titleobj',titleobj);

                titleobj.each(function(i){
                    let position = $(this).find('._3ea9._3eaa').html() || $(this).find('._3ea9').html() || $(this).find('.x1yc453h.xlyipyv.xeaf4i8 .xt0psk2').html() || "";
                    position = position.replace(/<span>*.*<\/span>/g, "")
                    //console.log('position',position.toLowerCase());
                    switch(position.toLowerCase()){
                        case "campaign id":
                            arr['campaign_id']=i;
                            break;
                        case "ad set id":
                            arr['ad_set_id']=i;
                            break;
                        case "ad id":
                            arr['ad_id']=i;
                            break;
                        case "results":
                            arr['results']=i;
                            break;
                        case "amount spent":
                            arr['amount_spent']=i;
                            break;
                        case "purchase roas (return on ad spend)":
                            arr['p_roas']=i;
                            break;
                        default:
                            break;
                    }
                })

                console.log('arr',arr);

                if((!arr['campaign_id'] && arr['campaign_id']!=0) || (!arr['results'] && arr['results']!=0) || (!arr['amount_spent'] && arr['amount_spent']!=0) || (!arr['p_roas'] && arr['amount_spent']!=0)){
                    return util.message.error('Add columns for "Campaign ID, Ad Set ID, Ad ID, Results, Amount Spent, Purchase ROAS" ');
                }

                let col = "";
                let allqty=0,alltotal=0;
                if($("._5a1n._3c7k ._1gd5").length>0){
                    $("._5a1n._3c7k ._1gd5").each(function(i){
                        //根据tab类型获取判断依据
                        switch(type){
                            case "ads":
                                col = arr['ad_id'];
                                break;
                            case "adsets":
                                col = arr['ad_set_id'];
                                break;
                            case "campaigns":
                                col = arr['campaign_id'];
                                break;
                            default:
                                break;
                        }

                        let rowObj = $(this).find('._3pzk:nth-child(2)'); //每行数据对象
                        console.log("rowObj",rowObj);
                        console.log("rowObj 1",rowObj[0]);
//                         let markidObj = rowObj.find("._4h2m:nth-child("+(col+1)+")").find('._4ik5'); //判断依据列数据对象
                        let markidObj = rowObj.find("._4h2m").eq(col).find('._4ik5');
                        let markid = markidObj.html(); //判断依据列值
                        let resultsObj = rowObj.find("._4h2m:nth-child("+(arr['results']+1)+")").find('._1ha3'); //成效列对象
                        if(resultsObj.length<1){
                            resultsObj = rowObj.find("._4h2m:nth-child("+(arr['results']+1)+")").find('._7el8'); //成效列对象
                        }
                        if(resultsObj.length<1){
                            resultsObj = rowObj.find("._4h2m").eq(arr['results']).find('.xuxw1ft.xbsr9hj');
                        }
                        let spentObj = rowObj.find("._4h2m:nth-child("+(arr['amount_spent']+1)+")").find('._3dfj'); //广告花费列对象
                        if(spentObj.length<1){
                            spentObj = rowObj.find("._4h2m").eq(arr['amount_spent']).find('._3dfj');
                        }
                        let proasObj = rowObj.find("._4h2m:nth-child("+(arr['p_roas']+1)+")").find('._1ha3 span'); //广告花费回报-购物
                        if(proasObj.length<1){
//                             proasObj = rowObj.find("._4h2m:nth-child("+(arr['p_roas']+1)+")").find('._7el8'); //成效列对象
                            proasObj = rowObj.find("._4h2m:nth-child("+(arr['p_roas']+1)+")").find('.xmi5d70.xuxw1ft').find('.xt0psk2'); //成效列对象(没值，只有-）
                            if(proasObj.length<1){
                                proasObj = rowObj.find("._4h2m:nth-child("+(arr['p_roas']+1)+")").find('.xmi5d70.xuxw1ft') //成效列对象(没下划线）
                            }
                            if(proasObj.length<1){
                                proasObj = rowObj.find("._4h2m").eq(arr['p_roas']).find('.xmi5d70.xuxw1ft');
                            }
                            if(proasObj.length<1){
                                proasObj = rowObj.find("._4h2m").eq(arr['p_roas']).find('.xuxw1ft.xbsr9hj');
                            }
                        }
                        //                     let wproasObj = rowObj.find("._4h2m:nth-child("+(arr['wp_roas']+1)+")").find('._1ha3 span'); //广告花费回报-网站购物

                        //对接口返回值进行匹配
                        $.map( utmdata, function( val, index ) {
                            //根据类型获取判断依据
                            let datamark = "";
                            switch(type){
                                case "ads":
                                    datamark = val.content_id
                                    break;
                                case "adsets":
                                    datamark = val.term_id
                                    break;
                                case "campaigns":
                                    datamark = val.medium_id
                                    break;
                                default:
                                    break;
                            }

                            if(markid === datamark || $(markid).text() === datamark){
                                allqty += val.qty*100
                                alltotal += val.total*100
                            }

                            //匹配成功时在同行必要的数据展示列中增加展示元素
                            if(markid === datamark){
                                let datamarkHtml = "<span class='showbg markcol'>"+datamark+"</span>";
                                let datamarkVal = datamark
//                                 if(typeof(val.overlaps) != "undefined" && val.overlaps.length>0){
//                                     datamarkHtml = "<span class='showbg markcol show-waringing' data-overlaps='"+JSON.stringify(val.overlaps)+"' data-campaignId='"+datamark+"'>"+datamark+" (!)</span>";
//                                     datamarkVal = datamark+" (!)";
//                                 }
                                markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamarkVal):markidObj.prepend(datamarkHtml)
                                resultsObj.find('span.showbg').length>0?resultsObj.find('span').html(val.qty):resultsObj.prepend("<span class='showbg'>"+val.qty+"</span>")
                                let spentAmount = spentObj.html().substring(1).replace(",", ""); //订单总额除广告花费
                                let roas = spentAmount>0?(val.total/spentAmount).toFixed(2):"";
                                proasObj.find('span.showbg').length>0?proasObj.find('span').html(roas):(roas>0?proasObj.prepend("<span class='showbg'>"+roas+"</span>"):"")
                                //                             wproasObj.find('span').length>0?wproasObj.find('span').html(roas):(roas>0?wproasObj.prepend("<span class='showbg'>"+roas+"</span>"):"")
                            }
                        });
                    })
                }

                if($("tbody.om3e55n1.g4tp4svg").length>0){
                    $("tbody.om3e55n1.g4tp4svg tr").each(function(i){
                        //根据tab类型获取判断依据
                        switch(type){
                            case "ads":
                                col = arr['ad_id'];
                                break;
                            case "adsets":
                                col = arr['ad_set_id'];
                                break;
                            case "campaigns":
                                col = arr['campaign_id'];
                                break;
                            default:
                                break;
                        }

                        let rowObj = $(this); //每行数据对象
//                         let markidObj = rowObj.find(".pwnh9qyi:nth-child("+(col+1)+")").find('._4ik5'); //判断依据列数据对象
                        let markidObj = rowObj.find("._4h2m").eq(col).find('._4ik5');
                        let markid = markidObj.html(); //判断依据列值
                        let resultsObj = rowObj.find(".pwnh9qyi:nth-child("+(arr['results']+1)+")").find('._1ha3'); //成效列对象
                        if(resultsObj.length<1){
                            resultsObj = rowObj.find(".pwnh9qyi").eq(arr['results']).find('.xuxw1ft._1ha3');
                        }
                        let spentObj = rowObj.find(".pwnh9qyi:nth-child("+(arr['amount_spent']+1)+")").find('._3dfj'); //广告花费列对象
                        if(spentObj.length<1){
                            spentObj = rowObj.find(".pwnh9qyi").eq(arr['amount_spent']).find('._3dfj');
                        }
                        let proasObj = rowObj.find(".pwnh9qyi:nth-child("+(arr['p_roas']+1)+")").find('._1ha3 span'); //广告花费回报-购物
                        if(proasObj.length<1){
                            proasObj = rowObj.find(".pwnh9qyi").eq(arr['p_roas']).find('._1ha3 span');
                        }

                        //对接口返回值进行匹配
                        $.map( utmdata, function( val, index ) {
                            //根据类型获取判断依据
                            let datamark = "";
                            switch(type){
                                case "ads":
                                    datamark = val.content_id
                                    break;
                                case "adsets":
                                    datamark = val.term_id
                                    break;
                                case "campaigns":
                                    datamark = val.medium_id
                                    break;
                                default:
                                    break;
                            }

                            if(markid === datamark || $(markid).text() === datamark){
                                allqty += val.qty*100
                                alltotal += val.total*100
                            }

                            //匹配成功时在同行必要的数据展示列中增加展示元素
                            if(markid === datamark){
                                let datamarkHtml = "<span class='showbg markcol'>"+datamark+"</span>";
                                let datamarkVal = datamark
//                                 if(typeof(val.overlaps) != "undefined" && val.overlaps.length>0){
//                                     datamarkHtml = "<span class='showbg markcol show-waringing' data-overlaps='"+JSON.stringify(val.overlaps)+"' data-campaignId='"+datamark+"'>"+datamark+" (!)</span>";
//                                     datamarkVal = datamark+" (!)";
//                                 }
                                markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamarkVal):markidObj.prepend(datamarkHtml)
                                //markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamark):markidObj.prepend("<span class='showbg markcol'>"+datamark+"</span>")
                                resultsObj.find('span.showbg').length>0?resultsObj.find('span').html(val.qty):resultsObj.prepend("<span class='showbg'>"+val.qty+"</span>")
                                let spentAmount = spentObj.html().substring(1); //订单总额除广告花费
                                let roas = spentAmount>0?(val.total/spentAmount).toFixed(2):"";
                                proasObj.find('span.showbg').length>0?proasObj.find('span').html(roas):(roas>0?proasObj.prepend("<span class='showbg'>"+roas+"</span>"):"")
                            }
                        });
                    })
                }

                ////底部统计
                //if($("._3h1b._1mic ._1gd5").length>0){
                //    $("._3h1b._1mic ._1gd5").each(function(i){
                //	//根据tab类型获取判断依据
                //	switch(type){
                //	    case "ads":
                //		col = arr['ad_id'];
                //		break;
                //	    case "adsets":
                //		col = arr['ad_set_id'];
                //		break;
                //	    case "campaigns":
                //		col = arr['campaign_id'];
                //		break;
                //	    default:
                //		break;
                //	}
                //
                //	let lastrowObj = $(this).find('._3pzk:nth-child(2)'); //每行数据对象
                //	//let lastmarkidObj = lastrowObj.find("._4h2m:nth-child("+(col+1)+")").find('._4ik5'); //判断依据列数据对象
                //	//let lastmarkid = markidObj.html(); //判断依据列值
                //	let lastresultsObj = lastrowObj.find("._4h2m:nth-child("+(arr['results']+1)+")").find('._1ha3'); //成效列对象
                //	let lastspentObj = lastrowObj.find("._4h2m:nth-child("+(arr['amount_spent']+1)+")").find('._3dfj'); //广告花费列对象
                //	let lastproasObj = lastrowObj.find("._4h2m:nth-child("+(arr['p_roas']+1)+")").find('._1ha3'); //广告花费回报-购物
                //	//                     let wproasObj = lastrowObj.find("._4h2m:nth-child("+(arr['wp_roas']+1)+")").find('._1ha3 span'); //广告花费回报-网站购物
                //
                //	//对接口返回值进行小计后匹配
                //	//let allqty=0,alltotal=0;
                //	//$.map( utmdata, function( val, index ) {
                //	//    allqty += val.qty*100
                //	//    alltotal += val.total*100
                //	//})
                //	allqty = allqty/100;
                //	alltotal = alltotal/100;
                //	console.log("allqty",allqty);
                //	console.log("alltotal",alltotal);
                //	//lastmarkidObj.find('span.showbg').length>0?lastmarkidObj.find('span').html(datamark):lastmarkidObj.prepend("<span class='showbg markcol'>"+datamark+"</span>")
                //	lastresultsObj.find('span.showbg').length>0?lastresultsObj.find('span.showbg').html(allqty):lastresultsObj.prepend("<span class='showbg'>"+allqty+"</span>")
                //	let lastspentAmount = lastspentObj.html().substring(1).replace(",", ""); //订单总额除广告花费
                //	console.log("lastspentAmount",lastspentAmount);
                //	let lastroas = lastspentAmount>0?(alltotal/lastspentAmount).toFixed(2):"";
                //	console.log("lastroas",lastroas);
                //	lastproasObj.find('span.showbg').length>0?lastproasObj.find('span.showbg').html(lastroas):(lastroas>0?lastproasObj.prepend("<span class='showbg'>"+lastroas+"</span>"):"")
                //    })
                //}

                //存储最新的主体数据列表
                util.setStorage(act+'_tabelElement',$(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html())
            }else{
                return util.message.error('Parameter error');
            }
        }, 3000);
    }

    setInterval(async function(){
        let pageURL = $(location).attr("href");
        let urlarr = pageURL.match("manage/(.*)[\?]act=");
        type = $.trim(urlarr[1]);
        if(type == "campaigns" || type == "adsets" || type == "ads"){
            if(!siteadd){
                //位于Campaigns div后, 以便小屏下UI展示
                console.log('addhtml start')
                if(campaignsElementClass3.length>0){
                    $(campaignsElementClass3).after(addhtml)
                    siteadd = true;
                }else if($(campaignsElementClass).length>0){
                    $(campaignsElementClass).after(addhtml)
                    siteadd = true;
                }else if(campaignsElementClass2.length>0){
                    $(campaignsElementClass2).after(addhtml)
                    siteadd = true;
                }

                //siteadd = true;

                //获取站点数据
                let siteres = await util.get("https://openapi.ycimedia.net/sak-api/facebook/utm/sites")
                //let siteres = await util.get("https://capi.webtoolurl.com/sak-api/facebook/utm/sites")
                if(siteres.code==1){
                    $("#myDropdown").html('')
                    $.map( siteres.data, function( val, i ) {
                        $("#myDropdown").append('<a data-id="'+val.id+'">'+val.name+'</a>')
                    });
                }else{
                    return util.message.error('There is no site');
                }

                //展示下拉或隐藏
                $('#myInput').on('focus',function(){
                    $( "#myDropdown" ).toggle('show');
                })

                //站点列表autocomplete
                $('#myInput').on('keyup',function(){
                    let filter = $('#myInput').val().toUpperCase();
                    if(filter){
                        $("#myDropdown a").each(function(i){
                            if($(this).text().toUpperCase().indexOf(filter) > -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                    }else{
                        $("#myDropdown a").show();
                    }
                })

                //站点选择
                $("#myDropdown a").each(function(i){
                    $(this).on('click',function(){
                        let siteIdOld = util.getStorage(act+'_siteId')
                        let siteNameOld = util.getStorage(act+'_siteName')
                        siteId = $(this).data('id')
                        siteName = $(this).text();
                        $("#myDropdown" ).toggle('show');
                        if(siteIdOld != siteId || siteNameOld != siteName){
                            util.setStorage(act+'_siteId',siteId)
                            util.setStorage(act+'_siteName',siteName)
                            refreshdata = false
                            $( "#myInput" ).val(siteName)
                            return util.message.success('Select shopify site success');
                        }
                    })
                })

                //开关
                $('.trackbox').on('change',function(){
                    if ($(this).prop("checked")) {
                        if(!siteId){
                            $(this).prop("checked",false)
                            return util.message.error('Please select shopify site');
                        }
                        util.setStorage(act+'_trackBtn',"open")
                        refreshdata = false
                        track();
                    }else{
                        util.setStorage(act+'_trackBtn',"close")
                        $('span.showbg').remove();
                        clearInterval(tracking);
                    }
                })

                if(trackBtn=="open"){
                    track();
                }
            }
            $('.sakerHtmlElement').slice(1).remove();
        }else{
            console.log('111')
            siteadd = false;
            clearInterval(tracking);
            $("#sakerHtml").remove();
        }
    }, 3000);

    $('body').on('click',".show-waringing", function(){
        let campaignId = $(this).attr('data-campaignId');
        let overlaps = $(this).attr('data-overlaps');
        if(campaignId && overlaps){
           let campaignHtml = "Campaign ID: "+campaignId;
           let overlapsData = JSON.parse(overlaps);
           let overlapsHtml = "<ul class='overlaps-box'>";
           overlapsData.map((item)=>{
             overlapsHtml+= "<li class='overlaps-item'>"+item.compared_campaign_id+": "+(item.intersection_rate*100).toFixed(2)+"%</li>"
           })
           overlapsHtml += "</ul>";
           return util.message.popup(campaignHtml,overlapsHtml);
        }
    })
})();