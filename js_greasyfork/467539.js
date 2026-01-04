// ==UserScript==
// @name         食品
// @namespace    hhh2000
// @version      0.1
// @description  食品--
// @author       hhh2000
// @match        http*://172.20.234.92/*
// @run-at       document-end
// @grant        none
// @compatible   chrome
/* globals jQuery, $, waitForkeyElements */
/* eslint-disable no-multi-spaces, dot-notation */
/* eslint no-eval:0 */
// @downloadURL https://update.greasyfork.org/scripts/467539/%E9%A3%9F%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/467539/%E9%A3%9F%E5%93%81.meta.js
// ==/UserScript==

//'use strict';
(function() {
    // @match        http*://172.20.234.92/sdfda/*
    let log = console.log;
    let dif = console.dir;
    let err = console.error;
    // function dir(e) {console.dir(e)}
    // function err(e) {console.error(e)}
    function set_value(key, value){ localStorage.setItem(key, value) }
    function get_value(key, default_value){ return localStorage.getItem(key) || default_value }
    function change_value(o1, o2, k){ let v = o1[k]; o1[k] = o2[k]; o2[k] = v }
    function waitForTrue(ifTrue, callback, time=100) {
        if(--time < 0) {err('waitForTrue 超时 '+ifTrue); return false;}
        const fn = waitForTrue;
        //let fn = arguments.callee;
        if (ifTrue()) {
            callback(); return true;
        } else {
            setTimeout(function() { fn(ifTrue, callback, time); }, 50);
        }
    }
    //$("#dialog-close", window.parent.document)[0].dispatchEvent( new MouseEvent('click') );  //关闭证书打印页面
    function LoadJS(id, fileUrl) {
        var scriptTag = document.getElementById(id);
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript= document.createElement("script");
        if ( scriptTag  ) oHead.removeChild(scriptTag);
        oScript.id = id;
        oScript.type = "text/javascript";
        oScript.src=fileUrl ;
        oHead.appendChild(oScript);
    }
    function imitateEvent(event,selector,x=0,y=0){
        let ev = new MouseEvent(event)
        ev.initMouseEvent(event,true,true,window,1,0,0,x,y,0,0,0,0,0,null);
        return selector.dispatchEvent(ev);
    }
    //console.clear();
    console.log(window.location.href);
    //localStorage.clear();
    if(window.location.href.indexOf('portal/jsp/welcome.jsp') !== -1){
        // var parent = window.parent.window.document.getElementById('applyExt').parentNode;
        // var i = window.parent.window.document.createElement('i');
        // var a = window.parent.window.document.createElement('a');
        // i.className += 'pic pic_14 g3-icon';
        // a.className += 'icon1 icon-effect-1 icon-effect-1a';
        // a.appendChild(i);
        // a.href = 'http://172.20.234.92:8080/sdfda/jsp/dsp/public/ythlogin.jsp?redirectUrl=http%3A%2F%2F172.20.234.92%3A8080%2Fsdfda%2Fjsp%2Fdsp%2Fbizwork%2Ftasklist%2Ftodotask%2Ftodotask_proc_list.jsp';
        // //log(a.href);
        // parent.appendChild(a);

        //console.log(document.getElementById('#applyText'))
        //document.name = 'hhh'
        //log(document.name);
        window.addEventListener('message',function(e){
            //console.log('message');
            //console.log(e.origin);
            //console.log(e.data);
            // window.did = e.data[0];
            // window.title = e.data[1];

        },false);

        //是否打印操作
        //localStorage.setItem("print", 'false');

        let applyExt = window.parent.window.document.getElementById('applyExt');
        applyExt.addEventListener('DOMNodeInserted', function fn_(e) {
            //typeof e.target.className === 'string' && e.target.className !== '' && log(e.target.className);
            if(typeof e.target.className === 'string' && e.target.className === 'nav navbar-nav'){
                //this.removeEventListener('DOMNodeInserted', arguments.callee);
                this.removeEventListener('DOMNodeInserted', fn_);
                let appMap = window.parent.window.appMap;
                let url_0 = appMap.map['000000000000000000000002019452'].children[0].children[0];
                let url_1 = appMap.map['000000000000000000000002019452'].children[1].children[0].children[0];
                let children_tmp = url_0.children[0];
                url_0.children[0] = url_1.children[0];
                url_1.children[0] = children_tmp;

                let applyExt = window.parent.window.document.getElementById('applyExt');
                let shipin_node = applyExt.childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[3];  //食品经营——我的代办
                shipin_node.dispatchEvent(new MouseEvent('click'));
            }
        })
    }else if(get_value('print') !== 'false' && window.location.href.indexOf('editor_dialog.jsp') !== -1){  //cke_myeditor_arialbl 所见即所得编辑器
        log('-----所见即所得编辑器打印-----');

        LoadJS('hhh_pnlDetailTemplate', "/sdfda/jsp/cform/skin/js/jquery.js");  //加载jQuery
        waitForTrue(()=>typeof jQuery !== "undefined" && $('iframe.cke_wysiwyg_frame').contents().find('body').length > 0, ()=>{
            log('-----所见即所得编辑器打印（√）-----');

            //等待页面加载完成
            let outer = null;
            let count = 0;
            let Interval_id = setInterval(()=>{
                let frame_body = $('iframe.cke_wysiwyg_frame').contents().find('body')[0];
                //if(++count > 10) clearInterval(Interval_id);
                if(outer === frame_body.outerHTML){
                    clearInterval(Interval_id);
                    $('#cke_18').click();
                    $('.l-btn-text.delete').click();
                }
                outer = frame_body.outerHTML;
            }, 50);
        });
    }else if(get_value('print') !== 'false' && window.location.href.indexOf('templateselect_dialog.jsp') !== -1){  // #printEvent 证书打印 templateDetailGrid
        log('-----证书打印页面-----');
        //问题: LoadJS加载执行需要时间，jQuery 和 $('.l-grid3-row')都需要加载完
        LoadJS('hhh_pnlDetailTemplate', "/sdfda/jsp/cform/skin/js/jquery.js");  //加载jQuery
        let interval_id;
        let timeout_id;
        waitForTrue(()=>typeof jQuery !== "undefined" && $('.l-grid3-row').length >= 9, ()=>{
            log('-----证书打印页面（√）-----');

            log(`[${get_value("print")}]`);
            let print_list = get_value("print").split(',');

            //循环打印
            clearInterval(interval_id);
            interval_id = setInterval(function(){
                if($('iframe#dialog-body').length === 0){
                    let detail_name = print_list.pop();

                    //打印完成
                    if(detail_name === undefined){
                        log('=======打印完成退出=======');
                        $("#dialog-close", window.parent.document)[0].dispatchEvent( new MouseEvent('click') );  //关闭证书打印页面
                        clearInterval(interval_id);
                        clearInterval(timeout_id);
                        set_value("print", 'false');
                        return false;
                    }

                    //打印指定表
                    $('.l-grid3-row .l-grid3-col-detailName').each(function(){
                        if($(this).text() === detail_name){
                            log('打印: '+detail_name);
                            imitateEvent('dblclick', this);
                            return false;  //break
                        }
                    })
                }
            },100)

            //超时退出（10分钟）
            clearTimeout(timeout_id);
            timeout_id = setTimeout(()=>{ clearInterval(interval_id) }, 1000*60*10);
        });
    }else if(get_value('print') !== 'false' && window.location.href.indexOf('openSecPlatForward.jsp') !== -1){   // $('#formframe #htmlContainer') 1 《食品经营许可证》申请表
        log('申请表单')
    }else if(window.location.href.indexOf('formrender.jsp') !== -1){  // $('#formframe #htmlContainer') 2 《食品经营许可证》申请表
        log('-----《食品经营许可证》申请表-----')
        waitForTrue(()=>$('[id^=DSP_SDYJ]').length > 0, ()=>{  //  申请（核发）DSP_SDYJ_SPJY_HF、变更DSP_SDYJ_SPJY_BG
            if($('#DSP_SDYJ_SPJY_HF').length === 1) window.scrollTo(0,800);  //滚动到“经营项目”
            if($('#DSP_SDYJ_SPJY_BG').length === 1) window.scrollTo(0,900);  //滚动到“经营项目”

            //判断网页是否已经加载完成
            let html = ''
            let height = 0
            function ok(){
                let ok_input = false;
                let ok_html = false;
                let ok_printevent = false;
                let ok_height = false;

                //$('input[name^=经营项目]').each(function(){ ok_input|=$(this)[0].checked });

                if($(document)[0].outerHTML === html){ ok_html = true }
                html = $(document)[0].outerHTML;

                ok_printevent = !$('#printEvent', window.parent.document).hasClass('l-item-disabled');

                if(document.body.scrollHeight + document.body.clientHeight === height){ ok_height = true }
                height = document.body.scrollHeight + document.body.clientHeight;

                //log('ok_input: '+ok_input+'  ok_html:'+ok_html+'  ok_printevent: '+ok_printevent+'  ok_height: '+ok_height);

                return !ok_input & ok_html & ok_printevent & ok_height;
            }

            if(get_value('print') !== 'false'){
                log('-----《食品经营许可证》申请表（√）-----');
                //根据经营项目得到打印列表
                function get_print_list(){
                    let print_list = [];
                    waitForTrue(()=>ok(), ()=>{
                        //取得打印list name
                        //$('input[name=经营项目食品]').each(function(){
                        $('input[name=经营项目食品],input[name=变更食品销售]').each(function(){
                            let not_ybz = $(this).parent().text().indexOf('预包装食品') === -1;
                            if(this.checked === true && not_ybz) { print_list.push('食品销售经营许可现场核查表'); return false; }
                        })
                        let item = ['冷食类食品制售','生食类食品制售','糕点类食品制售（含裱花蛋糕）','自制饮品制售（不含使用压力容器制作饮品）'];
                        //$('input[name=经营项目餐饮服务]').each(function(){
                        $('input[name=经营项目餐饮服务],input[name=变更餐饮服务]').each(function(){
                            let text = $(this).parent().text();
                            let is_special_room = item.includes(text);
                            if(this.checked === true) { print_list.includes('餐饮服务经营许可现场核查表') ? null : print_list.push('餐饮服务经营许可现场核查表'); }
                            if(this.checked === true && is_special_room) { print_list.push('专间及专用操作场所现场核查表'); return false; }
                        })
                        print_list.push('食品经营许可现场核查记录新办');
                        print_list.push('食品经营许可现场核查记录变更');
                        //log(print_list)

                        //保存打印list name
                        set_value("print", print_list.join());

                        log('-----许可证申请表打印-----');
                        setTimeout(()=>window.print(),100);  //难以判断是否加载完成,预留100ms

                        log('-----mainPanel 打印-----');
                        $('#printEvent', window.parent.document).click();
                    });
                }
                setTimeout(get_print_list(), 100);
            }else{
                //选择审查办理人
                function select_actor(){
                    log('-----选择审查办理人-----')
                    let print_list = []
                    waitForTrue(()=>ok(), ()=>{
                        log('-----选择审查办理人（√）-----')
                        let $selectNextActorImg = $('#selectNextActorImg', window.parent.document)
                        $('#nextActorInput', window.parent.document).width('50%')
                        let $sc = $selectNextActorImg.after($('<button id="selectShenCha" style="margin-left: 5px">快捷选择</button>')).next()
                        $sc.off('click.hhh_selectShenCha').on('click.hhh_selectShenCha', ()=>{
                            log('-----快捷选择-----')
                            $selectNextActorImg.attr('autoselect', 'true').click()
                        })
                    })
                }
                setTimeout(select_actor(), 100);
            }
        })
    }else if(1&&window.location.href.indexOf('selectNextActor.jsp') !== -1){
        log('-----选择审查办理人-----')
        LoadJS('hhh_selectNextActor', "/sdfda/jsp/cform/skin/js/jquery.js");  //加载jQuery
        //等待jQuery和页面加载完成
        waitForTrue(()=> typeof jQuery === 'function' && ($('button.l-btn-text.query').length > 0), ()=>{
            log('-----选择审查办理人（√）-----')
            let $selectNextActorImg = $('#selectNextActorImg', window.parent.document)
            if($selectNextActorImg.attr('autoselect') !== 'true') return
            $selectNextActorImg.attr('autoselect', 'false')

            $('#selectActorTabPanel__allMemberTree')[0].dispatchEvent( new MouseEvent('mousedown',{ bubbles:true }) )
            log('-----选择李奎军-----')
            waitForTrue(()=> $('.l-tree-node-expanded:last ~ ul').find('span:contains(李奎军)').length > 0, ()=>{
                log('-----选择李奎军（√）-----')
                $('.l-tree-node-expanded:last ~ ul').find('span:contains(李奎军)').click()
                $('.l-btn-text.yes').click()
            })
        })
        //setTimeout(()=>{log(typeof jQuery)},2000)
    }else if(1&&window.location.href.indexOf('todotask_city_list.jsp') !== -1){
        var filter = '';
        let is_cell_break = null;
        let is_run = false;
        let is_filter_first_run = true;
        new MutationObserver((mutations, observer) => {
            mutations.forEach(mutation => {
                const target = mutation.target;
                //typeof target.className === 'string' && target.className !== '' && log(target.className);
                //return;
                //typeof target.className === 'string' && target.className === 'l-grid3-cell-inner l-grid3-col-numberer' && log(target.className);
                if(target.className === 'l-panel l-grid-panel'){  //显示全部
                    $('#L5-comp-1045').trigger('click');
                    log('^^^^^显示全部^^^^^')
                    //}else if(target.className === 'l-grid3-header-offset2') {  //l-tip-header l-unselectable | l-grid3-header-offset
                    //    log('-------'+$('#shipin_filter').length+'  =='+$('.l-grid3-cell-inner.l-grid3-col-4[hhh_data]').length+'==');
                    //    log($('.l-grid3-cell-inner.l-grid3-col-4').length);
                    //}else if(target.className === 'l-tip-header l-unselectable') {  //l-tip-header l-unselectable | l-grid3-header-offset
                }else if(1&&is_run===false&&target.className === 'l-grid3-cell-inner l-grid3-col-numberer') {  //自动过滤窑头组
                    log('======自动过滤窑头组======');
                    $('.l-grid3-body').css('display','none');
                    clearTimeout(is_cell_break);
                    //自动过滤窑头组
                    is_cell_break = setTimeout(function(){
                        let $input = $('#shipin_filter').find('input');
                        let t = $input[0];
                        let evt = document.createEvent('HTMLEvents');
                        evt.initEvent('input', true, true);
                        t.value='yt';
                        t.dispatchEvent(evt);
                        $('.l-grid3-body').css('display','block');
                        is_run = true;
                        log('======自动过滤窑头组（√）======');
                        //
                        // log($('#000000000000000000000002013867').length)
                        // log($('.l-grid3-body').length)
                        // log($(window.document).length)
                        // log($('iframe').length)
                        // log(document.name);
                        //log(top.postMessage('hhh'),'http://172.20.234.92:8000/portal/jsp/welcome.jsp')
                        //log(window.parent.window.postMessage('hhh'),'*')
                    },200)
                }else if(is_filter_first_run===true && target.className === 'l-grid3-header-offset' && $('.l-grid3-cell-inner.l-grid3-col-4[hhh_data]').length<1) {  //l-tip-header l-unselectable | l-grid3-header-offset
                    log('*********'+target.className)
                    is_filter_first_run = false
                    set_value('print', 'false')
                    //let applyExt = window.parent.window.document.getElementById('applyExt');
                    //let shipin_node = applyExt.childNodes[0].childNodes[1].childNodes[1].childNodes[0];  //食品经营——我的代办
                    //  log(shipin_node)
                    //log(window.parent)

                    var 审批事项名称class     = '.l-grid3-cell-inner.l-grid3-col-4';
                    var 申请当事人class       = '.l-grid3-cell-inner.l-grid3-col-5';
                    var 网上申请号class       = '.l-grid3-cell-inner.l-grid3-col-6';
                    var 序号class             = '.l-grid3-cell-inner.l-grid3-col-numberer';

                    //过滤INPUT
                    if($('#shipin_filter').length < 1){
                        $('#L5-comp-1041 td:first').after($(`<td><span class="ytb-sep"></span></td>
                                                             <td id="shipin_filter"><input type=text value="Filter" style="height:20px;width:150px;color:#a3a3a3;outline:none;border:1px solid #cccccc"></input></td>`));
                        //过滤操作
                        let $input = $('#shipin_filter').find('input');
                        $input.on('focus',function(e){
                            $(this).css({color:'black'});
                            if($(this).val() === 'Filter') $(this).val('');
                        }).on('blur',function(e){
                            $(this).css({color:'#a3a3a3'});
                            if($(this).val() === '') $(this).val('Filter');
                        }).on('input',function(){  //查找
                            var filter_val = $(this).val().trim();
                            var filter_type = '地址';
                            var filter = '/'+filter_val.replace(/\s+/g, '|')+'/';

                            if(filter_val[0] === '@'){
                                filter_type = '企业名称';
                                filter_val = filter_val.slice(1);
                                filter = '/'+filter_val.replace(/\s+/g, '|')+'/';
                            }else if(filter_val === 'b' || filter_val === 'yt'){
                                // let 燕山银座 = '银座燕山购物广场 | 燕山银座 | 银座购物广场燕山店 | 银座商城燕山店 | 经十路13777号 | ';
                                // let 万象城   = '万象城 | 华润中心写字楼 | 华润中心SOHO | 经十路11111号 | 博越星光城 | ';
                                // let 窑头     = '窑头路 | 窑头小区 | 友谊苑小区 | 华森碧云天 | 恒泉花园 | 友谊苑[^北] | ';
                                // let 大润发   = '大润发省博 | 省博大润发 | 省博物馆大润发 | 大润发 | 山东美术馆 | 山东档案馆 | 省美术馆 | 省档案馆 |';
                                // let 中润     = '中润世纪城 | 中润世纪锋 | 中润世纪中心 | 中润世纪广场 | 中润世纪三期 | 经十路12111号 | ';
                                // let 二环路   = '二环东路6060号 | 二环东路5746号 | 二环东路(?!(明珠花园|7\\d{3}|燕东山庄)) | ';
                                // let 文博广场 = '文博广场西侧 | 文博广场一层 | 文博广场地下一层 | 经十东?路11899号 | ';
                                // let 圣洋     = '圣洋物流 | 圣洋市场 | 经十东路129号| 经十路129号 | 姚家南路(1|2|4|6|8) | 经十[东]路1\\d{2}号 |';
                                // let 浆水泉路 = '浆水泉路(?!(.*?正大城市|16号|28号|8-|北段路东|17号|28-|28号|姚家庄))';
                                let 小区 = '保利华庭 | 翡翠大观 | 花园小镇 | 汇隆广场 | 景苑启城 | 泰悅赫府 | 泰悦赫府 | 万科城 | 新悦广场 |';
                                let 商城 = '花园里家园 | 十里河菜市场 | 十里河农贸市场 | 十里河社区菜市场 | 星河工业园 | 星河商城 |';
                                let 路   = '奥体西路2377 | 花园东路177 | 花园东路3666 | 花园东路3766 | 花园东路3888号 | 花园路3766 | 花园路东段177 | 花园路东段17号 | 花园路东首177号 | 花园路东首路南 | 华龙路25号 | 华龙路28号 | 华龙路38号 | 华能路 | 华阳路 | 化纤厂路';
                                filter = '/'+小区+商城+路+'/';
                                filter = filter.replace(/\s+/g,'');
                            }

                            log('======过滤循环======')
                            log(filter);
                            let count = 0
                            $('.l-grid3-body .l-grid3-row').each(function(){  //业务列表循环
                                let $this = $(this);
                                //过滤
                                let data;
                                if(filter_type === '企业名称') data = $this.find(申请当事人class).text();
                                else data = $this.find(审批事项名称class).attr('hhh_data');
                                //log(data)
                                //log('业务列表循环'+data+'   '+data.match(filter) +'  '+filter+'   '+data.match(/解放东路/));
                                if(!data || data.match(eval(filter)) !== null){
                                    $this.css('display', 'block')
                                    count++
                                }else{
                                    $this.css('display', 'none')
                                }
                            })
                            log(count)
                            $('.l-grid3-hd-row>td:first>div').css('color', 'blue').text(count)
                            //log($('.l-grid3-hd-row>td:first>div'))

                        })
                    }

                    //调整宽度 l-grid3-col l-grid3-cell l-grid3-td-4
                    // $('.l-grid3-hd.l-grid3-cell.l-grid3-td-4').width(700);
                    // $('.l-grid3-col.l-grid3-cell.l-grid3-td-4').width(700);

                    log('======审批事项名称循环======')
                    log('filter:', filter)
                    $(审批事项名称class).each(function(){
                        let reg = $(this).find('a').attr('onclick').match(/'[-\w]+',/g);
                        let uniqueID = reg[1].match(/\w+/)[0];
                        let fromID = reg[4].match(/\w+/)[0];
                        let dataID = reg[5].match(/\w+/)[0];
                        //log(`${uniqueID} ${fromID} ${dataID}`);
                        var $this = $(this);

                        //变更、延续等用不同颜色标注
                        let text = $this.text();
                        for(let [type, color] of Object.entries({'变更':'green', '延续':'darkorange', '》(?!申请)': 'darkgrey'})){  // key是正则表达式
                            if(new RegExp(`${type}`).test(text) === true){
                                $this.find('a').css('color', color);
                                break;
                            }
                        }

                        var $row = $this.parentsUntil('.l-grid3-body', '.l-grid3-row');
                        var key = 'hhh_' + $row.find(申请当事人class).text() + '|' + $row.find(网上申请号class).text();
                        var value = get_value(key);
                        let num = $row.find(序号class).text()
                        //log(num+'------------ '+key+' - '+num)
                        //log(value)
                        if(!value){
                            $.get('http://172.20.234.92:7013/sdfda/command/dispatcher/org.loushang.cform.tasklist.cmd.RenderDispatcherCmd/renderForm', {actDefUniqueId:uniqueID,formId:fromID,formDataId:dataID}, function(data){
                                var ret = JSON.parse(data);
                                //log(ret)
                                let DSP_SDYJ_SPJY_HF = JSON.parse(JSON.parse(ret['formData'])[fromID]);
                                //log(DSP_SDYJ_SPJY_HF)
                                let JingYingChangSuo = DSP_SDYJ_SPJY_HF['JingYingChangSuo'];
                                let LianXiRen = DSP_SDYJ_SPJY_HF['LianXiRen'];
                                let LianXiShouJiHaoMa = DSP_SDYJ_SPJY_HF['LianXiShouJiHaoMa'];
                                let save_data = `${JingYingChangSuo} | ${LianXiRen} | ${LianXiShouJiHaoMa}`;
                                //log(save_data)
                                //过滤
                                if(JingYingChangSuo.indexOf(filter) !== -1){
                                    //log('=====过滤===== '+filter)
                                    let text = $this.find('a').text()
                                    let $txt_node
                                    //添加文本
                                    if($this.find('a font').length === 1) $txt_node = $this.find('a font')
                                    else $txt_node = $this.find('a')
                                    $txt_node.text(`${text} | ${save_data}`)
                                }
                                //添加数据
                                //log('=====添加数据===== '+key)
                                set_value(key, save_data);
                                //添加attr
                                $this.attr('hhh_data', save_data);
                            });
                        }else{
                            //log(value)
                            let JingYingChangSuo = value.split(/\s*|\s*/)[0];
                            //过滤
                            //log('=====过滤2===== '+filter)
                            if(JingYingChangSuo.indexOf(filter) !== -1){
                                let text = $this.find('a').text()
                                let $txt_node

                                //添加文本
                                if($this.find('a font').length === 1) $txt_node = $this.find('a font')
                                else $txt_node = $this.find('a')
                                $txt_node.text(`${text} | ${value}`)
                                //添加attr
                                $this.attr('hhh_data', value)
                                //添加打印信息
                                let print_info = get_value(`打印：${value}`)
                                if(print_info === 'true'){
                                    $txt_node.append($(`<span style="color: blue"> | √</span>`))
                                }
                            }
                        }
                    })

                    log('======调整列表宽度======')
                    //调整列表宽度
                    let t = setInterval(function(){
                        let max_width = 0;
                        $('.l-grid3-body .l-grid3-row:visible').each(function(){  //过滤后的业务列表循环
                            let width = $(this).find(审批事项名称class)[0].scrollWidth;
                            if(width > 0) max_width = Math.max(max_width, width);
                        })
                        if(max_width > 0){
                            $('.l-grid3-hd.l-grid3-cell.l-grid3-td-4').width(max_width+50);
                            $('.l-grid3-col.l-grid3-cell.l-grid3-td-4').width(max_width+50);
                            clearTimeout(t);
                        }
                    },50)

                    //设置查看还是打印
                    // log($('.l-grid3-cell-inner.l-grid3-col-4 a:first').length)
                    // $('.l-grid3-cell-inner.l-grid3-col-4 a:first').on('click', function(e){
                    //     log('======查看（√）======')
                    //     set_value('print', 'false');
                    // })

                    log('======添加打印按钮======')
                    //添加打印按钮
                    $('.l-grid3-cell-inner.l-grid3-col-4').add('.l-grid3-cell-inner.l-grid3-col-5').on('mouseenter', function(e){
                        let $this = $(this);
                        if($this.hasClass('l-grid3-col-5')) { $this = $this.parent().parent().find('.l-grid3-col-4') }
                        $this.css({'display':'flex', 'justify-content':'space-between'});
                        $('.hhh_print').off('click.hhh_print');
                        $('.hhh_print').remove();
                        $('<div class="hhh_print"><a href="javascript:void(0);" style="text-decoration:none">（打印）</a></div>').appendTo($this);

                        let print_info = get_value(`打印：${$this.attr('hhh_data')}`);
                        $('.hhh_print a').text(`${print_info === 'true' ? '（打印√）' : '（打印）'}`);
                        //点击打印
                        $('.hhh_print').on('click.hhh_print', function(e){
                            log('======开始打印（√）======')
                            $this.find('a:first').click();

                            set_value(`打印：${$this.attr('hhh_data')}`, 'true');  //标记已打印
                            set_value('print', 'true');

                            return false;
                        });
                    })
                }
            });
        }).observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
})();


