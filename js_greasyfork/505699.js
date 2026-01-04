// ==UserScript==
// @name         wiki表格输出测试
// @namespace    https://sstm.moe/profile/197610-367ddd/
// @version      0.5
// @description  统计特定用户发布的主题中，标题里带有特定字符串的主题，用于统计系列主题，输出的字符串为wiki可使用的格式
// @author       367ddd(叫我牛顿吧)
// @match        https://sstm.moe/topic/177580-*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505699/wiki%E8%A1%A8%E6%A0%BC%E8%BE%93%E5%87%BA%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/505699/wiki%E8%A1%A8%E6%A0%BC%E8%BE%93%E5%87%BA%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let searchstring=['黄油日记'];//搜索字符串，可复数
    let searchdisablestring=['白水贴'];//黑名单
    let searchtag='心情';//tag搜索，仅单个
    let searchmode=2;//1仅按字符串搜索，2按字符串和前缀搜索，3仅按前缀搜索
    let userid = 11438;
    let seriestring=['東方界元老级歌姬3L','同人音楽'];//用户主题筛选用字符串
    let disablestring=['白水贴','毕业中汉化'];//用户主题筛选用黑名单
    let searchtoggle=0;//搜索开关，1开0关
    let seriestoggle=1;//用户主题筛选开关，1开0关
    let rowlength=40;//换行长度
    //
    const behindareas=['申请&测试区','版主交流区','SS大学','工作组区','萌军前线','市场仓库','Gal伊甸遗迹','暗の广场','历史遗迹','中二病房'];
    const specialareas=['版务公告区','活动申请区','漫区旧案陈放处'];
    const innerareas=['下限の深渊','同人游戏交流区','同人资源区','汉化交流区','机翻资源区','汉化资源浏览区','魔物娘图鉴专区','天坑开发中心','雷神天制霸','动漫资源区','新番连载','动画分享','动画里区','漫画世界','漫画里区','动漫自购/自翻区'];
    const legendusers=['6350','14','18','20','21','91','165','182','220','436','222',
                       '334','277','579','21657','5595','1740','8228','8483','16010','26577','19575',
                       '7','25480','45760','28','12406','55381','47469','25659','19005','10523','22127',
                       '58254','61563','109','6599','14957','11438','41156','54938','57086','12839','92073',
                       '47714','137133','69744','35797','65468','4274','142805','6944','61896','9696','22',
                       '117544','142805','41311','99144','71477','54033','19000','70056','176','151441','160774',
                       '299857','145605','34932','174254','1046','194061','160331','207423','308723','12277','65412',
                       '207135','226143','39508','144296','16074','256133','252619','221139','303194','89920','1428',
                       '38','1200','653','29163','48074','53388','5772','6095','71093','116435','70155','237286']
    const wikiusers=[['6350','雛咲深紅'],['14','天空'],['18','被遗忘の記憶'],['20','Saviorangle'],['21','天無辰'],['91','克莉娅丝'],['165','逝去王女'],['182','Saka'],['220','克莉絲提亞'],['222','某神的傀儡'],['436','Chinho'],
                     ['334','Miracle'],['277','修女'],['579','神のPFP'],['21657','风荷'],['5595','闇夜の影'],['1740','柳葉白菀'],['8228','醉箭'],['8483','Sandroaep'],['16010','A130a11'],['19575','空空'],['26577','苍云静岳'],
                     ['7','游戏游戏123'],['25480','胡子'],['45760','25480'],['28','腹黑魔宅'],['12406','Q4'],['55381','巴奈'],['47469','寒冰の轨迹'],['25659','亚由'],['19005','悠一'],['10523','面具'],['22127','结局的续篇'],
                     ['58254','小茜茜'],['61563','Meister1234'],['109','Hentai14'],['6599','塖ぁ檒'],['14957','助手酱'],['11438','織雪'],['41156','狐仙銀白'],['57086','鸡明桑'],['12839','赤紅の涙'],['92073','JavelinTea'],['54938','人妻小蝶酱'],
                     ['69744','街饮'],['137133','Eternalの无心'],['47714','雨墨'],['35797','传奇殿堂-月见闪光'],['65468','查理兔'],['4274','泛夜。'],['16428','無路'],['6944','Spirtie'],['61896','Hanxu246'],['9696','辉夜の桐'],['22','星旧怀雪'],
                     ['142805','Κris'],['117544','喵了个喵，咪'],['41311','Kami丶米'],['99144','萌小a'],['71477','星霜の言葉'],['54033','凌若'],['19000','Dzero'],['70056','Ppzt'],['176','墨镜娘'],['151441','久帝'],['160774','心淵リバイブ.炙羽'],
                     ['299857','DDD0325'],['145605','霄月'],['34932','河城乃藥'],['174254','予鲤倾碧塘'],['1046','Imisao'],['194061','羊駝'],['160331','邂逅酱'],['207423','厭世平胸雞'],['308723','梦幻妖精'],['12277','眼镜娘'],['65412','提辖'],
                     ['207135','远河悠步'],['226143','Dorothy'],['39508','信奈的野望'],['144296','奈々原風子'],['16074','鑢七花'],
                     ['256133','三星太阳'],['252619','咲间薇雅'],['221139','乱跑的泰兰德'],['303194','悠哉卡萌睡大觉'],['89920','上条当麻'],
                     ['1428','八雲橙'],['38','YD教授'],['1200','秋叶、未尽'],['653','Yoyo子'],['29163','Drakedog'],['53388','Aa911210'],['48074','月下的孤狼'],['5772','13312552'],['6095','用钢笔的人'],['71093','Cjy5511411'],['70155','尤菲斯'],['116435','铃Beru'],['237286','海王星的海星']]
    function delcrossline(str){
        const regex = /\r\n|\r|\n|\u000A|\u000D|~~~|    /g;
        return str.replace(regex, ' ');
    }
    function cutdown(str){
        let index= str.indexOf('-');
        return(str.substring(0,index)+'-1/');
    }
    function gettitle(str){
        let index= str.indexOf('-');
        return(str.substring(index+2));
    }
    function addbr(str){
        let newstr=str.substring(0,40);
        let i=0;
        for(i=1;(i*rowlength)<=str.length;i++){
            //console.log('<br>'+str.substring(rowlength*i,rowlength*i+rowlength));
            newstr+='<br>'+str.substring(rowlength*i,rowlength*i+rowlength);
        }
        return(newstr);
    }
    var output='';
    var output2='';
    var output3='';
    let searchnums=1;
    let searchinpage=1;
    let searchallpages=1;
    let nums=1;
    let inpage=1;
    let allpages=1;
    let outyear=1980;
    function search(page){
        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        let link='https://sstm.moe/search/?';
        if(searchmode<3){
            link+='q=';
            searchstring.some(function(item){
                link+=item+' ';
            })
        }
        if(searchmode==2){link+='&';}
        if(searchmode>1){
            link+='tags='+searchtag+'&eitherTermsOrTags=and';
        }
        link+='&page='+page+'&quick=1&type=forums_topic&updated_after=any&sortby=newest&search_and_or=or&search_in=titles';
        xhr.open('GET',link , true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error()}
                if(page==1){
                    if($(doc).find('li.ipsPagination_last>a').length>0){
                        searchallpages=parseInt($(doc).find('li.ipsPagination_last>a').attr('data-page'));
                        console.log('searchallpages:'+searchallpages);
                    }
                }
                $(doc).find('ol.ipsStream.ipsList_reset >li').each(function(){
                    let nowuserlink=cutdown(decodeURI($(this).find('p.ipsType_reset.ipsStreamItem_status.ipsType_blendLinks>a')[0].href));
                    let nowuserid=nowuserlink.match(/\d{1,10}/)[0]
                    let nowuser=$(this).find('p.ipsType_reset.ipsStreamItem_status.ipsType_blendLinks>a')[0].innerText.trim();
                    let nowtopiclink=cutdown(decodeURI($(this).find('span.ipsType_break.ipsContained>a')[0].href));
                    let nowtopic=delcrossline($(this).find('span.ipsType_break.ipsContained>a')[0].innerText.trim());
                    let nowarea=$(this).find('p.ipsType_reset.ipsStreamItem_status.ipsType_blendLinks>a')[1].innerText.trim();
                    let redirect='error';
                    //console.log(nowtopic+':'+nowuser+':'+nowuserid+':'+disablestring.some(function(item){return(nowtopic.includes(item))})+':'+seriestring.some(function(item){return(nowtopic.includes(item))}));
                    if(!(searchdisablestring.some(function(item){return(nowtopic.includes(item))}))&&searchstring.some(function(item){return(nowtopic.includes(item))})){
                        output3+='|a'+searchnums+'=[';
                        if(wikiusers.some(function(item){redirect=item[1];return(nowuserid==item[0]);})){
                            output3+='['+redirect+']';
                        }
                        else{
                            output3+=nowuserlink+' '+nowuser;
                        }
                        output3+=']\n|i'+searchnums+'=['+nowtopiclink+' '+addbr(nowtopic)+']';
                        if($(this).find('.fa-eye-slash').length>0||behindareas.some(function(item){return(nowarea.includes(item))})){
                            output3+='{{上角标|限}}';
                        }else if(specialareas.some(function(item){return(nowarea.includes(item))})){
                            output3+='{{上角标|特}}';
                        }else if(innerareas.some(function(item){return(nowarea.includes(item))})){
                            output3+='{{上角标|里}}';
                        }
                        output3+='\n';
                        searchnums++;
                    }
                })
                searchinpage++;
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    function mainsearch(){
        output3='{{AutoTabTable\n|display3=false\n';
        searchinpage=1;
        searchallpages=1;
        searchnums=1;
        let outpage=1;
        let setint= setInterval(function(){
            if(searchinpage>searchallpages){
                clearInterval(setint);
                alert('搜索完毕');
                console.log(output3+'}}');
            }
            if(searchinpage==outpage&&searchinpage<=searchallpages){
                search(searchinpage);outpage++;
            }
        },200);
    }
    function searchseries(page){
        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        xhr.open('GET', 'https://sstm.moe/profile/'+userid+'-*/content/page/'+page+'/?type=forums_topic&sortby=start_date&sortdirection=asc', true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error('doc is null')}
                if(page==1){
                    if($(doc).find('li.ipsPagination_last>a').length>0){
                        allpages=parseInt($(doc).find('li.ipsPagination_last>a').attr('data-page'));
                        console.log('seriesallpages'+allpages);
                    }
                }
                $(doc).find('ol[data-role="tableRows"]>li').each(function(){
                    //console.log(decodeURI($(this).find('span.ipsType_break.ipsContained>a')[0].href).trim());//标题输出，供进度显示用
                    let temp=this;
                    if(!(disablestring.some(function(item){return($(temp).find('span.ipsType_break.ipsContained>a')[0].innerText.trim().includes(item))}))&&seriestring.some(function(item){return($(temp).find('span.ipsType_break.ipsContained>a')[0].innerText.trim()).includes(item)})){
                        //console.log('testtest\n');
                        let nowtopiclink=cutdown(decodeURI($(this).find('span.ipsType_break.ipsContained>a')[0].href));
                        let nowtopic=delcrossline($(this).find('span.ipsType_break.ipsContained>a')[0].innerText.trim());
                        let musictitle=gettitle(nowtopic);
                        let nowtime =new Date($(this).find('p.ipsType_reset.ipsType_medium.ipsType_light>time')[0].getAttribute('datetime'));
                        let nowyear =nowtime.getFullYear();
                        let nowarea=$(this).find('p.ipsType_reset.ipsType_medium.ipsType_light>a')[1].innerText.trim();
                        //console.log('nowtime:'+nowtime+'outyear'+outyear);
                        if(nowyear!=outyear){
                            if(outyear!=1900){
                                output+='|-\n|}';
                            }
                            output+=''+nowyear+'\n:{| class="wikitable" style="font-size:3;text-align:center;"\n|-\n!colspan="4"|'+seriestring[0]+'\n|-\n! 期数||本期标题||地址\n';
                            outyear=nowyear;
                        }
                        output+=('|-\n|第'+nums+'期||\'\'\''+addbr(nowtopic)+'\'\'\'||['+nowtopiclink+' 地址]');
                        output2+='*'+$(this).find('p.ipsType_reset.ipsType_medium.ipsType_light>time')[0].getAttribute('title').substring(0,11)+'，发布第'+nums+'期'+seriestring[0]+'系列—\'\'\''+nowtopic+'\'\'\'<ref>['+nowtopiclink+' '+nowtopic.replace(/\[/g,'【').replace(/\]/g,'】')+']'
                        if($(this).find('.fa-eye-slash').length>0||behindareas.some(function(item){return(nowarea.includes(item))})){
                            output+='{{上角标|限}}';
                            output2+='{{上角标|限}}';
                        }else if(specialareas.some(function(item){return(nowarea.includes(item))})){
                            output+='{{上角标|特}}';
                            output2+='{{上角标|特}}';
                        }else if(innerareas.some(function(item){return(nowarea.includes(item))})){
                            output+='{{上角标|里}}';
                            output2+='{{上角标|里}}';
                        }
                        output+='\n';
                        output2+='</ref>。\n';
                        nums++;
                    }
                })
                inpage++;
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    function mainseries(){
        output ='';
        output2='==历史==\n';
        inpage=1;
        outyear=1900;
        nums=1;
        let outpage=1;
        let setint= setInterval(function(){
            if(inpage>allpages){
                clearInterval(setint);
                alert('用户主题筛选完毕');
                console.log(output+='|-\n|}');
                console.log(output2);
            }
            if(inpage==outpage&&inpage<=allpages){
                searchseries(inpage);outpage++;
            }
        },200);
    }
    if(searchtoggle){mainsearch();}
    if(seriestoggle){mainseries();}
    // Your code here...
})();