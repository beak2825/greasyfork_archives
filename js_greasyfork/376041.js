// ==UserScript==
// @name         Steam 工作坊模组辅助脚本
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  辅助管理Steam工作坊模组清单的脚本工具
// @author       LaysDragon镭锶龙
// @match        https://steamcommunity.com/id/*/myworkshopfiles/*
// @match        https://steamcommunity.com/profiles/*/myworkshopfiles/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.1/URI.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376041/Steam%20%E5%B7%A5%E4%BD%9C%E5%9D%8A%E6%A8%A1%E7%BB%84%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/376041/Steam%20%E5%B7%A5%E4%BD%9C%E5%9D%8A%E6%A8%A1%E7%BB%84%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.URI = URI;
    var $NJ = $;
    window.$NJ = $;
    $.noConflict()
    //var URI = URI;
    //var saveAs = saveAs;

    if(typeof URI().query(true).appid === 'undefined' || URI().query(true).appid === "0" || URI().query(true).browsefilter !== 'mysubscriptions'){
        return;
    }

    //$NJ("head").append ('<link href="https://code.jquery.com/ui/1.12.1/themes/vader/jquery-ui.css" rel="stylesheet" type="text/css">');

    $NJ('.rightDetailsBlock:eq(1)').prepend('<br>');
    //$NJ('.rightDetailsBlock:eq(1)').prepend($NJ('<span class="btn_green_white_innerfade btn_medium" style="margin:0px 10px 10px 0px"> <span> 格式转换 </span> </span>').click(openEditorTools));
    $NJ('.rightDetailsBlock:eq(1)').prepend($NJ('<span class="btn_green_white_innerfade btn_medium" style="margin:0px 10px 10px 0px"> <span> 导入模组 </span> </span>').click(startImport));
    $NJ('.rightDetailsBlock:eq(1)').prepend($NJ('<span class="btn_green_white_innerfade btn_medium" style="margin:0px 10px 10px 0px"> <span> 导出模组 </span> </span>').click(startExport));



    $NJ('body').append($NJ(`
<form class="smallForm" method="POST" name="PublishedFileSubscribe" id="PublishedFileSubscribe" action="https://steamcommunity.com/sharedfiles/subscribe">
<input type="hidden" name="id" value="">
<input type="hidden" name="appid" value="">
<input type="hidden" name="sessionid" value="${getSessionID()}">
</form>
`))
    function getSessionID(){
        return $NJ('form#PublishedFileUnsubscribe input[name="sessionid"]').val() || g_sessionID;
    }
    function getPageList(){
        return $NJ('[id^=Subscription]').map(function(){
            let ele = $NJ(this);
            //https://steamcommunity.com/sharedfiles/filedetails/?id=
            return {
                name:ele.find('.workshopItemTitle').text(),
                //link:ele.find('a:has(div.workshopItemTitle)').attr('href'),
                id:URI(ele.find('a:has(div.workshopItemTitle)').attr('href')).query(true).id,
                //img:ele.find('img.workshopItemPreviewImage').attr('src')
            }
        }).get();
    }
    function currentMaxItems(){
        let all = new Set(['10','20','30']);
        let items = new Set($NJ('.workshopBrowsePaging div:eq(0) a').map(function(){return $NJ(this).text()}).get());
        let target = [...all].filter(x => !items.has(x));
        return target[0];

    }
    function selectMaxItems(value){
        let all = new Set(['10','20','30']);
        if(!all.has(value)){
            throw new Error('Invalid Select Option');
        }
        $NJ(`.workshopBrowsePaging div:eq(0) a:contains("${value}")`)[0].click();
    }


    function hasNextPage(){
        let nextPageButton = $NJ('.workshopBrowsePagingControls:first').find('span:contains(">"),a:contains(">")');
        return nextPageButton.length!=0 && !nextPageButton.hasClass('disabled');
    }
    function goNextPage(){
        $NJ('.workshopBrowsePagingControls:first').find('span:contains(">"),a:contains(">")')[0].click();
    }
    //status: STOP PROCESSING
    function getStatus(){
        return localStorage.getItem('exporterStatus')||"STOP";
    }

    let allFlags = new Set(['TASK_CLEAR_IMPORT']);
    function setFlag(flag){
        if(!allFlags.has(flag)){
            throw new Error('Invalid Flag');
        }
        localStorage.setItem('exporterFlag_'+flag,true);
    }

    function clearFlag(flag){
        if(!allFlags.has(flag)){
            throw new Error('Invalid Flag');
        }
        localStorage.setItem('exporterFlag_'+flag,false);
    }

    function getFlag(flag){
        if(!allFlags.has(flag)){
            throw new Error('Invalid Flag');
        }
        return JSON.parse(localStorage.getItem('exporterFlag_'+flag)||'false');
    }

    function getAppID(){
        return URI().query(true).appid;
    }
    function getAppName(){
        return $NJ
        ('.HeaderUserInfoSection:last').text();
    }
    function getUserID(){
        return URI().segment(1);
    }
    function setStatus(status){
        let all = new Set(['STOP','PROCESSING']);
        if(!all.has(status)){
            throw new Error('Invalid Status');
        }
        localStorage.setItem('exporterStatus',status);
    }
    function getListData(){
        return JSON.parse(localStorage.getItem('exporterLists')||'[]');
    }
    function setListData(data){
        localStorage.setItem('exporterLists',JSON.stringify(data));
    }

    function getImportListData(){
        return JSON.parse(localStorage.getItem('exporterImportLists')||'[]');
    }
    function setImportListData(data){
        localStorage.setItem('exporterImportLists',JSON.stringify(data));
    }

    function startExport(){

        //$NJ( "#export_notification_dialog" ).dialog();
        ShowBlockingWaitDialog('导出MOD清单','脚本正在进行模组资料收集作业，请稍后...');
        if(getStatus()=="STOP"){
            setStatus('PROCESSING');
            setListData([]);
            location.href = URI().search(function(data) {
                data.p = 1;
                return data;
            }).toString();
        }
    }
    function startImport(){
        {
            function handleFileSelect(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                if(evt.type == "drop"){
                    var file = evt.originalEvent.dataTransfer.files[0];
                }else{
                    var file = evt.target.files[0];
                }

                var reader = new FileReader();
                reader.onload = function(event) {
                    $TextArea.val(event.target.result);
                };
                reader.readAsText(file);
            }

            let $Body = $NJ('<div/>');


            $Body.append( $NJ(`<p>请填入&nbsp;压缩base64&nbsp;或者&nbsp;JSON&nbsp;字串</p>`));

            let $FileRead = $NJ('<input/>',{'type':'file','style':'display:none;'});
            let $FileDrop = $NJ(`<div id="drop_zone" style="border: 2px dashed #bbb;border-radius: 5px;padding: 25px;text-align: center; color: #bbb;margin: 10px;cursor: pointer;">点击上传档案或将文件拖放到此处</div>`);
            $FileDrop.on("drop",handleFileSelect);
            $FileDrop.on("dragover",function (evt) {
                evt.originalEvent.stopPropagation();
                evt.originalEvent.preventDefault();
                evt.originalEvent.dataTransfer.dropEffect = 'copy';
            });
            $FileDrop.click(function(){$FileRead.click()});

            $FileRead.change(handleFileSelect);
            $Body.append($FileRead);
            $Body.append($FileDrop);
            let $TextArea = $NJ('<textarea/>' , { 'class': 'newmodal_prompt_textarea' } );
            $Body.append( $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel fullwidth ' } ).append( $TextArea ) );

            var deferred = new jQuery.Deferred();
            var fnOK = function() { deferred.resolve( $TextArea.val() ); };
            var fnCancel = function() { deferred.reject(); };

            let $okButton = $NJ('<button/>', {type: 'submit', 'class': 'btn_green_white_innerfade btn_medium' } ).append( $NJ( '<span/>' ).text( '导入' ) );
            $okButton.click( function(){
                importing($TextArea.val());
                Modal.Dismiss();
            } );
            deferred.always( function() { Modal.Dismiss(); } );

            let $ConvertButton = $NJ('<button/>', {type: 'submit', 'class': 'btn_darkred_white_innerfade btn_medium' } ).append( $NJ( '<span/>' ).text( '转换' ) );
            $ConvertButton.click( ()=>{
                try{
                    openSaver(tryParseData($TextArea.val()));
                    fnCancel();
                }catch(e){
                    ShowAlertDialog('错误',e.message);
                }
            });

            let $CancelButton = _BuildDialogButton( '取消' );
            $CancelButton.click( fnCancel);


            let Modal = _BuildDialog( '导入模组清单', $Body, [$okButton,$ConvertButton, $CancelButton ],fnCancel );
            deferred.promise( Modal );
            Modal.Show();


        }

    }
    function openEditorTools(){
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if(evt.type == "drop"){
                var file = evt.originalEvent.dataTransfer.files[0];
            }else{
                var file = evt.target.files[0];
            }

            var reader = new FileReader();
            reader.onload = function(event) {
                processText(event.target.result);
            };
            reader.readAsText(file);
        }

        function processText(text){
            let data = tryParseData(text);
            $Base64TextArea.val(LZString.compressToBase64(JSON.stringify(data)));
            $JsonTextArea.val(JSON.stringify(data));
            $TextListTextArea.val(data.mods.map(item=>`${item.name} https://steamcommunity.com/sharedfiles/filedetails/?id=${item.id}`).join('\r\n'));
        }

        let $Body = $NJ('<div/>');

        $Body.append( $NJ(`<p>/>`).html(`请填入&nbsp;压缩base64&nbsp;或&nbsp;JSON&nbsp;字串`));

        let $FileRead = $NJ('<input/>',{'type':'file','style':'display:none;'});
        let $FileDrop = $NJ(`<div id="drop_zone" style="border: 2px dashed #bbb;border-radius: 5px;padding: 25px;text-align: center; color: #bbb;margin: 10px;cursor: pointer;">点击上传档案或将文件拖放到此处</div>`);
        $FileDrop.on("drop",handleFileSelect);
        $FileDrop.on("dragover",function (evt) {
            evt.originalEvent.stopPropagation();
            evt.originalEvent.preventDefault();
            evt.originalEvent.dataTransfer.dropEffect = 'copy';
        });
        $FileDrop.click(function(){$FileRead.click()});

        $FileRead.change(handleFileSelect);
        $Body.append($FileRead);
        $Body.append($FileDrop);
        let $TextAreaRow = $NJ('<div/>',{style:'display: table;border-spacing: 10px;'});

        let $Base64Col = $NJ('<div/>',{style:'display: table-cell;'})
        let $Base64Row = $NJ('<div/>')
        $Base64Row.append('<span>压缩Base64</span>')
        $Base64Row.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium',style:'margin:0px 5px;'} )
                               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('转换') )
                               .click(()=>processText($Base64TextArea.val())))
        let $Base64TextArea = $NJ('<textarea/>' , { 'class': 'newmodal_prompt_textarea',style:'width: 100%;' } );
        let $Base64TextAreaDiv = $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel ' } ).append( $Base64TextArea )
        $Base64Col.append($Base64Row)
        $Base64Col.append($Base64TextAreaDiv)
        $TextAreaRow.append($Base64Col );


        let $JsonCol = $NJ('<div/>',{style:'display: table-cell;'})
        let $JsonRow = $NJ('<div/>')
        $JsonRow.append('<span>JSON</span>')
        $JsonRow.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium',style:'margin:0px 5px;'} )
                               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('转换') )
                               .click(()=>processText($JsonTextArea.val())))
        let $JsonTextArea = $NJ('<textarea/>' , { 'class': 'newmodal_prompt_textarea',style:'width: 100%;' } );
        let $JsonTextAreaDiv = $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel ' } ).append( $JsonTextArea )
        $JsonCol.append($JsonRow)
        $JsonCol.append($JsonTextAreaDiv)
        $TextAreaRow.append($JsonCol );

        let $TextListCol = $NJ('<div/>',{style:'display: table-cell;'})
        let $TextListRow = $NJ('<div/>')
        $TextListRow.append('<span>列表</span>')
        //$TextListRow.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium',style:'margin:0px 5px;'} )
//                               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('转换') )
  //                             .click(()=>processText($TextListTextArea.val())))
        let $TextListTextArea = $NJ('<textarea/>' , { 'class': 'newmodal_prompt_textarea',style:'width: 100%;' , 'readonly':true} );
        let $TextListTextAreaDiv = $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel ' } ).append( $TextListTextArea )
        $TextListCol.append($TextListRow)
        $TextListCol.append($TextListTextAreaDiv)
        $TextAreaRow.append($TextListCol );


        $Body.append($TextAreaRow);

        var deferred = new jQuery.Deferred();
        var fnOK = function() { deferred.resolve( $TextArea.val() ); };
        var fnCancel = function() { deferred.reject(); };

        let $okButton = $NJ('<button/>', {type: 'submit', 'class': 'btn_green_white_innerfade btn_medium' } ).append( $NJ( '<span/>' ).text( '确定' ) );
        $okButton.click( function(){
            importing($TextArea.val());
            Modal.Dismiss();
        } );
        deferred.always( function() { Modal.Dismiss(); } );

        let $CancelButton = _BuildDialogButton( '取消' );
        $CancelButton.click( fnCancel);


        let Modal = _BuildDialog( '导入模组清单', $Body, [$okButton, $CancelButton ],fnCancel );
        deferred.promise( Modal );
        Modal.Show();
    }
    function tryParseJson(str) {
        try {
            var obj = JSON.parse(str);
        } catch (e) {
            return {success:false};
        }
        return {success:true,data:obj};
    }

    function importing(data){
        try{
            if(typeof data === "string"){
                var data = tryParseData(data);
            }

            setImportListData(data);
            if(data.appid!==getAppID()){
                throw new Error(`该存档字串游戏为 ${data.name}(${data.appid}) 不符合当前游戏 ${getAppName()}(${getAppID()})!`);
                return;
            }
            ShowConfirmDialog('請確認',`此次匯入共計${data.mods.length}個模組，內容為 ${data.mods.map(mod=>mod.name).join('、')}`,'確認','取消')
                .done(
                function(){
                    ShowConfirmDialog('清空模组列表','请问是否要清空现有的模组列表？','清空','保留')
                        .done(
                        function(){
                            setFlag('TASK_CLEAR_IMPORT');
                            startExport();
                        })
                        .fail(
                        function(){
                            SubscribeAll(data.mods,getAppID());
                        });
                });
        }catch(e){
            ShowAlertDialog('错误',e.message);
        }

    }

    function tryParseData(text){
        if(text.trim()===''){
            throw new Error('字串不能为空！');
            return;
        }
        text = text.trim();
        let data = tryParseJson(text);
        if(data.success){
            return data.data;

        }else{
            try{
                let data = JSON.parse(LZString.decompressFromBase64(text));
                return data;
            }catch (e) {
                throw new Error('字串解析错误！');
                return;
            }
        }

    }

    function saveListText(data){
        let text = data.mods.map(item=>`${item.name} https://steamcommunity.com/sharedfiles/filedetails/?id=${item.id}`).join('\r\n');
        saveText(text,`${getUserID()} ${getAppName()}(${getAppID()}) ${data.date} ${data.mods.length}个模组 清单.txt`);
    }

    function saveJson(data){
        let text = JSON.stringify(data);
        saveText(text,`${getUserID()} ${getAppName()}(${getAppID()}) ${data.date} ${data.mods.length}个模组 JSON.json`);
    }

    function saveText(text,filename){
        let dialog = ShowBlockingWaitDialog('匯出資料','脚本正在生成檔案中，请稍后...')
        setTimeout(()=>dialog.Dismiss(),3000);
        let data = new Blob([text], {type: 'text/plain;charset=utf-8'});
        saveAs(data, filename);
    }
    function timeout(time){
        return new Promise(function(resolve, reject) {
            setTimeout(resolve,time);
        });
    }
    function SubscribeAll(mods, appID ){
        let progressText = $NJ('<span/>');
        progressText.append('正在进行订阅程序...');
        let progressTextUpdated = $NJ(`<span>${mods[0].name}(0/${mods.length})</span>`);
        progressText.append(progressTextUpdated);
        let progress = ShowBlockingWaitDialog('处理中',progressText)
        var p = Promise.resolve();
        mods.forEach((mod,index) =>
                     p = p.then(() => timeout(100)).then(()=>SubscribeItem(mod,appID)).then(()=>progressTextUpdated.text((index+1)>=mods.length?`訂閱完成，共计${mods.length}个模组`:`${mods[index+1].name}(${index+1}/${mods.length})`))
                    );
        p.catch(function(e){
            progress.Dissmiss();
            ShowAlertDialog( '錯誤', '訂閱時發生錯誤:'+e.message );
        });
        p.then(function(){
            progress.Dismiss();
            ShowAlertDialog( '成功', `訂閱完成，共计${mods.length}个模组` ).done(
                function(){
                    location.href = URI().search(function(data) {
                        data.p = 1;
                        return data;
                    }).toString();
                });
        });
    }

    function SubscribeItem( mod, appID )
    {
        return new Promise(function(resolve, reject) {
            $('PublishedFileSubscribe').id.value = mod.id;
            $('PublishedFileSubscribe').appid.value = appID;
            $('PublishedFileSubscribe').request( {
                onSuccess: resolve
            } );
        });
    }
    function UnsubscribeAll()
    {
        var confirmDialog = ShowConfirmDialog( '全部取消訂閱？', '您確定要取消所有 Starbound 的訂閱嗎？<br><br>此動作無法復原！' );
        return new Promise(function(resolve, reject) {
            confirmDialog.done( function() {
                var waitingDialog = ShowBlockingWaitDialog( '請稍候', '正在取消您的訂閱…' );

                $NJ.post(
                    'https://steamcommunity.com/sharedfiles/unsubscribeall/',
                    { 'sessionid' : getSessionID(), 'appid': getAppID(), 'filetype' : 18 }
                ).done( function( data ) {
                    waitingDialog.Dismiss();

                    if ( data.success == 1 )
                    {
                        waitingDialog.Dismiss();
                        resolve();
                    }
                    else
                    {
                        ShowAlertDialog( '錯誤', '取消訂閱時發生錯誤' );
                        reject(new Error('取消訂閱時發生錯誤'))
                    }
                });


            }).fail(
                function(){
                    reject(new Error('使用者取消'));
                }
            );
        });
    }

    function clearImportTask(){
        UnsubscribeAll()
            .then(()=>SubscribeAll(getImportListData().mods,getAppID()))
            .catch((e)=>ShowAlertDialog( '錯誤', e.message ));
    }
    function openSaver(data,overwriteMode = false){

                let mode = "base64";
                let $Body = $NJ('<div/>');


                $Body.append( $NJ(`<p>本次的模组共${data.mods.length}个${overwriteMode?'，清空前请妥善保存模组存档资料':''}</p>`));
                //$Body.append( $NJ(`<p>模組清单json</p>`));

                //let $TextArea = $NJ('<textarea/>' );
                //$TextArea.text( JSON.stringify(data) );
                //$TextArea.click(function(){this.select();})
                //$Body.append( $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel fullwidth ' } ).append( $TextArea ) );
                let filename = '';
                function switchContent(type){
                    mode = type;
                    switch(type){
                        case 'base64':
                            filename = `${getUserID()} ${getAppName()}(${getAppID()}) ${data.date} ${data.mods.length}个模组.base64`
                            $TextArea.val( LZString.compressToBase64(JSON.stringify(data)));
                            break;
                        case 'json':
                            filename = `${getUserID()} ${getAppName()}(${getAppID()}) ${data.date} ${data.mods.length}个模组.json`
                            $TextArea.val( JSON.stringify(data));
                            break;
                        case 'textlist':
                            filename = `${getUserID()} ${getAppName()}(${getAppID()}) ${data.date} ${data.mods.length}个模组.txt`
                            $TextArea.val( data.mods.map(item=>`${item.name} https://steamcommunity.com/sharedfiles/filedetails/?id=${item.id}`).join('\r\n'));
                            break;
                    }
                }

                $Body.append( $NJ(`<p>存档字串，直接复制即可使用</p>`));
                let $tab = $NJ('<div/>',{class:'sectionTabs item responsive_hidden'})

                $tab.append( $NJ('<a/>', {'class': 'sectionTab active'} )
                            .append( $NJ( '<span/>', {'style':''} ).text('压缩base64') )
                            .click(
                    function(){
                        $NJ(this).parent().children().toggleClass( 'active', false );
                        $NJ(this).toggleClass( 'active', true );
                        switchContent('base64');
                    }));
                $tab.append( $NJ('<a/>', {'class': 'sectionTab'} )
                            .append( $NJ( '<span/>', {'style':''} ).text('JSON') )
                            .click(
                    function(){
                        $NJ(this).parent().children().toggleClass( 'active', false );
                        $NJ(this).toggleClass( 'active', true );
                        switchContent('json');
                    }));
                $tab.append( $NJ('<a/>', {'class': 'sectionTab'} )
                            .append( $NJ( '<span/>', {'style':''} ).text('列表') )
                            .click(
                    function(){
                        $NJ(this).parent().children().toggleClass( 'active', false );
                        $NJ(this).toggleClass( 'active', true );
                        switchContent('textlist');
                    }));

                //$tab.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium'} )
                //               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('压缩base64') )
                //               .click(()=>switchContent('base64')));
                //$tab.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium'} )
                //               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('JSON') )
                //               .click(()=>switchContent('json')));
                //$tab.append( $NJ('<button/>', {type: 'submit', 'class': 'btn_darkblue_white_innerfade btn_medium'} )
                //               .append( $NJ( '<span/>', {'style':'line-height: 20px;'} ).text('列表') )
                //               .click(()=>switchContent('textlist')));

                $Body.append( $tab);
                $Body.append( '<div id="tabs_baseline" class="responsive_tab_baseline"></div>');

                let $TextArea = $NJ('<textarea/>' , { 'class': 'newmodal_prompt_textarea', 'readonly':true } );

                $TextArea.click(function(){this.select();})
                $Body.append( $NJ('<div/>', {'class': 'newmodal_prompt_with_textarea gray_bevel fullwidth ' } ).append( $TextArea ) );

                let $copyButton = _BuildDialogButton( '复制' );
                $copyButton.click( function(){
                    $TextArea.select();
                    document.execCommand('copy');
                    ShowAlertDialog('成功','字串已复制到剪贴簿！');
                } );


                let $saveButton = $NJ('<button/>', {type: 'submit', 'class': 'btn_green_white_innerfade btn_medium' } ).append( $NJ( '<span/>' ).text( overwriteMode?'備份':'保存' ) );
                $saveButton.click( function(){
                    saveText($TextArea.val(),filename)
                } );

                let buttonList =  [$saveButton,$copyButton ];
                if(overwriteMode){
                    let $continueClearImportButton = $NJ('<button/>', {type: 'submit', 'class': 'btn_darkred_white_innerfade btn_medium' } ).append( $NJ( '<span/>' ).text( '清除所有并继续导入' ) );
                    $continueClearImportButton.click( function(){
                        clearImportTask();
                        Modal.Dismiss();
                    } );
                    buttonList.push($continueClearImportButton)
                }

                let Modal = _BuildDialog( overwriteMode?'模组列表备份完成':'模组列表收集完成', $Body,buttonList,function(){ Modal.Dismiss();;} );
                switchContent(mode);
                Modal.Show();

            }
    if(getStatus()=="STOP"){

    }else if(getStatus()=="PROCESSING"){
        let processing_dialog = ShowBlockingWaitDialog('导出MOD清单','脚本正在进行模组资料收集作业，请稍后...');
        if(currentMaxItems() != '30' && hasNextPage()){
            selectMaxItems('30');
            return;
        }


        let currentList = getListData();
        currentList.push(...getPageList());
        setListData(currentList);
        if(hasNextPage()){
            goNextPage();
        }else{
            let date = new Date();
            let data = {
                appid:getAppID(),
                name:getAppName(),
                date:`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
                mods:currentList
            }
            setStatus('STOP');
            processing_dialog.Dismiss();
            openSaver(data,getFlag('TASK_CLEAR_IMPORT'));
            clearFlag('TASK_CLEAR_IMPORT')
        }
    }else{
        console.error('strange status'+ getStatus());
    }

})();