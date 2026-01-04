// ==UserScript==
// @name         Google Ads UTM
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @description  Google Ads UTM Tool For Saker!
// @author       Jimmy
// @include      *.google.com/aw/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/455532/Google%20Ads%20UTM.user.js
// @updateURL https://update.greasyfork.org/scripts/455532/Google%20Ads%20UTM.meta.js
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
            }
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

    let act = "" ; //账户标记
    let from =""; //起始日期
    let to = ""; //结束日期
    let type = ""; //广告类型
    let siteId = ""; //站点ID
    let siteName = ""; //站点名称
    let trackBtn = "close"; //开关状态标记

    let campaignsElementClass = ".logo-button-container"; //左上角广告账户选项元素
    let dateElementClass = ".menu-lookalike span.button-text"; //右上角日期元素
    let tableElementClass = ".ess-table-canvas"; //主体数据列表
    let tableElementClass2 = ".ess-table-canvas"

    let utmdata = []; //接口数据列表

    //新增页面元素内容
    function addhtmlFun(siteName,trackBtn){
        let addhtml = '<div id="sakerHtml" style="display: flex;align-items: center; margin-left:20px;">'
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
        addhtml += '.showbg { padding: 0 5px; background-color: #ffc107; margin-right: 5px; font-weight: bold; border-radius: 10px; }';
        addhtml += '.markcol {display:block;text-align: center;padding: 2px 5px;margin-bottom: 2px;margin-left: -5px; border-radius: 5px;}';
        addhtml += '</style>';
        return addhtml;
    }


    function track(){
        tracking = setInterval(async function(){
            //判断主体数据列表中的数据是否有变化
//             let tabelElementOld = util.getStorage(act+'_tabelElement') || ""
//             let tabelElement = $(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html()
//             if(tabelElementOld != tabelElement){
//                 util.clog("tabelElement changed")
//                 $('span.showbg').remove();
//             }

            //日期处理
            let datestr = $(dateElementClass).html();
            console.log("datestr",datestr);
            let datestrarr=[];
            let from_arr = [];
            let to_arr = [];
            let from_date,from_month,from_year,to_date,to_month,to_year,dateArr
            if(datestr){
//                 if(datestr.indexOf(":") == -1){
//                     datestrarr = datestr.match("<div>(.*)&nbsp;");
//                     if(datestrarr == null){
//                         datestrarr = datestr.match(">(.*)&nbsp;");
//                     }
//                 }else{
//                     datestrarr = datestr.match(":(.*)&nbsp;");
//                 }
//                 let datestrnew = $.trim(datestrarr[1]);
                let datestrnew = datestr.replaceAll(" ", "").replaceAll("-", "–").replaceAll("年","-").replaceAll("月","-").replaceAll("日","");
                if(datestrnew.indexOf("–") == -1){
                    dateArr = datestrnew.split("–");
                    console.log("dateArr 1",dateArr)
                }else{
                    dateArr = datestrnew.split("–");
                    console.log("dateArr 2",dateArr)
                }
                if(dateArr.length>1){
                    from_arr = dateArr[0].split("-");
                    console.log('from_arr',from_arr);
                    console.log("length from_arr[0]",from_arr[0].length);
                    console.log("length from_arr[1]",from_arr[1].length);
                    console.log("length from_arr[2]",from_arr[2].length);
//                     if(from_arr[0].length>2 && from_arr[1].length<3){
//                         from = moment(dateArr[0], 'MMM.D.YYYY').format('YYYY-MM-DD');
//                     }else if(from_arr[0].length<3 && from_arr[1].length>2){
//                         from = moment(dateArr[0], 'D.MMM.YYYY').format('YYYY-MM-DD');
//                     }else{
//                         from = moment(dateArr[0]).format('YYYY-MM-DD');
//                     }

                    from = moment(dateArr[0]).format('YYYY-MM-DD');

                    to_arr = dateArr[1].split("-");
                    if(to_arr.length>2){
                        //年-月-日
                    }else if(to_arr.length>1){
                        dateArr[1] = from_arr[0]+"-"+dateArr[1]
                    }else if(to_arr.length>0){
                        dateArr[1] = from_arr[0]+"-"+from_arr[1]+"-"+dateArr[1]
                    }
//                     if(to_arr[0].length>2 && to_arr[1].length<3){
//                         to = moment(dateArr[1], 'MMM.D.YYYY').format('YYYY-MM-DD');
//                     }else if(to_arr[0].length<3 && to_arr[1].length>2){
//                         to = moment(dateArr[1], 'D.MMM.YYYY').format('YYYY-MM-DD');
//                     }else{
//                         to = moment(dateArr[1]).format('YYYY-MM-DD');
//                     }
                     to = moment(dateArr[1]).format('YYYY-MM-DD');
                }else{
                    from_arr = dateArr[0].split("-");
                    console.log('from_arr',from_arr);
                    console.log("length from_arr[0]",from_arr[0].length);
                    console.log("length from_arr[1]",from_arr[1].length);
                    console.log("length from_arr[2]",from_arr[2].length);
//                     if(from_arr[0].length>2 && from_arr[1].length<3){
//                         from = moment(dateArr[0], 'MMM.D.YYYY').format('YYYY-MM-DD');
//                     }else if(from_arr[0].length<3 && from_arr[1].length>2){
//                         from = moment(dateArr[0], 'D.MMM.YYYY').format('YYYY-MM-DD');
//                     }else{
//                         from = moment(dateArr[0]).format('YYYY-MM-DD');
//                     }
                    from = moment(dateArr[0]).format('YYYY-MM-DD');
                    to = "";
                }
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
            let urlarr = pageURL.match("aw/(.*)[\?]ocid=");
            if(!urlarr){
                urlarr = pageURL.match("aw/(.*)[\?]campaignId=");
            }
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
            if(daybetween>93){
                return util.message.error('The time period should not exceed 3 months');
            }


            //获取数据
            if(type && from && siteId){
                if(!refreshdata){
                    let formData = new FormData();
                    formData.append('type', type=="adgroups"?"adsets":type);
                    formData.append('from', from);
                    formData.append('to', to);
                    formData.append('siteid', siteId);
                    let utmres = await util.post("https://openapi.ycimedia.net/sak-api/facebook/utm/data",formData)
                    if(utmres.code==1){
                        refreshdata = true
                        utmdata = utmres.data;
                    }
                }
                console.log('utmdata',utmdata);

                //获取需要使用的选项所在列的位置
                let arr = []
                let titleobj = null;
                if($(".particle-table-first-header").find("div.particle-row-scroll-container div.particle-table-header-cell").length>0){
                    titleobj = $(".particle-table-first-header").find("div.particle-row-scroll-container div.particle-table-header-cell");
                }

                 console.log("titleobj",titleobj)

                titleobj.each(function(i){
                    let position = $(this).find('.particle-header-title').html().replaceAll("<!---->","").replaceAll("<tooltip></tooltip>","").trim() || "";
                    switch(position.toLowerCase()){
                        case "广告系列 id":
                        case "campaign id":
                            arr['campaign_id']=i;
                            break;
                        case "广告组 id":
                        case "ad group od":
                            arr['ad_set_id']=i;
                            break;
                        case "广告 id":
                        case "ad id":
                            arr['ad_id']=i;
                            break;
                        case "转化次数":
                        case "conversions":
                            arr['results']=i;
                            break;
                        case "费用":
                        case "cost":
                            arr['amount_spent']=i;
                            break;
                        case "转化价值/费用":
                        case "单位费用转化价值":
                        case "conv. value / cost":
                            arr['p_roas']=i;
                            break;
                        default:
//                             console.log("position.toLowerCase()",position.toLowerCase())
                            break;
                    }
                })

                console.log('arr',arr)

console.log('type 111',type)
                if(type == "ads"){
                    if((!arr['ad_id'] && arr['ad_id']!=0) || (!arr['results'] && arr['results']!=0) || (!arr['amount_spent'] && arr['amount_spent']!=0) || (!arr['p_roas'] && arr['amount_spent']!=0)){
                        return util.message.error('添加列 "广告 ID，费用, 转化次数, 单位费用转化价值(转化价值/费用)" ');
                    }
                }else if(type == "adgroups"){
                    if((!arr['ad_set_id'] && arr['ad_set_id']!=0) || (!arr['results'] && arr['results']!=0) || (!arr['amount_spent'] && arr['amount_spent']!=0) || (!arr['p_roas'] && arr['amount_spent']!=0)){
                        return util.message.error('添加列 "广告组 ID，费用, 转化次数, 单位费用转化价值(转化价值/费用)" ');
                    }
                }else if(type == "campaigns"){
                     if((!arr['campaign_id'] && arr['campaign_id']!=0) || (!arr['results'] && arr['results']!=0) || (!arr['amount_spent'] && arr['amount_spent']!=0) || (!arr['p_roas'] && arr['amount_spent']!=0)){
                         return util.message.error('添加列 "广告系列 ID，费用, 转化次数, 单位费用转化价值(转化价值/费用)" ');
                     }
                }

                let col = "";
                let allqty=0,alltotal=0;

                if($(".particle-table-noborder").find("div.particle-table-row:not(.particle-table-summary-row)").length>0){
                    $(".particle-table-noborder").find("div.particle-table-row:not(.particle-table-header-summary-row, .particle-table-summary-row)").each(function(i){

                        //根据tab类型获取判断依据
                        switch(type){
                            case "ads":
                                col = arr['ad_id'];
                                break;
                            case "adgroups":
                                col = arr['ad_set_id'];
                                break;
                            case "campaigns":
                                col = arr['campaign_id'];
                                break;
                            default:
                                break;
                        }

                        let rowObj = $(this).find('.particle-row-scroll-container'); //每行数据对象
                        console.log("rowObj",rowObj)
                        let markidObj = rowObj.find(".resizable:nth-child("+(col+1)+")").find('text-field'); //判断依据列数据对象
                        console.log("markidObj",markidObj)
                        let markid = markidObj.html().replaceAll("<!---->","").replaceAll("<tooltip></tooltip>","").trim(); //判断依据列值
                        console.log("markid",markid)

                        let resultsObj = rowObj.find(".resizable:nth-child("+(arr['results']+1)+")").find('.ess-cell-ellipsis'); //成效列对象
                        let spentObj = rowObj.find(".resizable:nth-child("+(arr['amount_spent']+1)+")").find('.ess-cell-ellipsis').find('span'); //广告花费列对象
                        if(spentObj.length<1){
                            spentObj = rowObj.find(".resizable:nth-child("+(arr['amount_spent']+1)+")").find('.ess-cell-ellipsis')
                        }
                        console.log("spentObj",spentObj.html())
                        let proasObj = rowObj.find(".resizable:nth-child("+(arr['p_roas']+1)+")").find('.ess-cell-ellipsis'); //广告花费回报-购物
                        //                     let wproasObj = rowObj.find("._4h2m:nth-child("+(arr['wp_roas']+1)+")").find('._1ha3 span'); //广告花费回报-网站购物

                        //对接口返回值进行匹配
                        $.map( utmdata, function( val, index ) {
                            //根据类型获取判断依据
                            let datamark = "";
                            switch(type){
                                case "ads":
                                    datamark = val.content_id
                                    break;
                                case "adgroups":
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
                                markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamark):markidObj.prepend("<span class='showbg markcol'>"+datamark+"</span>")
                                resultsObj.find('span.showbg').length>0?resultsObj.find('span').html(val.qty):resultsObj.prepend("<span class='showbg'>"+val.qty+"</span>")
                                let spentAmount = spentObj.html().substring(1).replaceAll(",", "").replaceAll("US$","").replaceAll("S$","").replaceAll("$","").replaceAll("<!---->","").replaceAll("<tooltip></tooltip>","").trim(); //订单总额除广告花费
                                console.log("spentAmount",spentAmount)
                                let roas = spentAmount>0?(val.total/spentAmount).toFixed(2):"";
                                proasObj.find('span.showbg').length>0?proasObj.find('span').html(roas):(roas>0?proasObj.prepend("<span class='showbg'>"+roas+"</span>"):"")
                            }
                        });
                    })
                }

                //存储最新的主体数据列表
                util.setStorage(act+'_tabelElement',$(tableElementClass).length>0?$(tableElementClass).html():$(tableElementClass2).html())
            }else{
                return util.message.error('Parameter error');
            }
        }, 3000);
    }

    setInterval(async function(){
        let pageURL = $(location).attr("href");
        let urlarr = pageURL.match("aw/(.*)[\?]ocid=");
        if(!urlarr){
            urlarr = pageURL.match("aw/(.*)[\?]campaignId=");
        }
        type = $.trim(urlarr[1]);
        console.log('type',type)
        if(type == "campaigns" || type == "adgroups" || type == "ads"){
            console.log('siteadd',siteadd);
            console.log('act',act);

            if(!siteadd && $(campaignsElementClass).length>0 && $(".account-info").length>0 ){
                let actstr = $(".account-info").html()
                act = actstr.trim().substring(0,12)
                console.log('act',act);

                from = util.getStorage(act+'_from') || ""; //起始日期
                to = util.getStorage(act+'_to') || ""; //结束日期
                type = util.getStorage(act+'_type') || ""; //广告类型
                siteId = util.getStorage(act+'_siteId') || ""; //站点ID
                siteName = util.getStorage(act+'_siteName') || ""; //站点名称
                trackBtn = util.getStorage(act+'_trackBtn') || "close"; //开关状态标记
                console.log(act+'_trackBtn',trackBtn);

                //位于Campaigns div后, 以便小屏下UI展示
                console.log('addhtml start')
                let addhtml = addhtmlFun(siteName,trackBtn)
                $(campaignsElementClass).after(addhtml)
                siteadd = true;

                //获取站点数据
                let siteres = await util.get("https://openapi.ycimedia.net/sak-api/facebook/utm/sites")
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
        }else{
            console.log('111')
            siteadd = false;
            clearInterval(tracking);
            $("#sakerHtml").remove();
        }
    }, 3000);
})();