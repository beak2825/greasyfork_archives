// ==UserScript==
// @name         慕课网笔记导出
// @namespace    https://github.com/yeomanye
// @version      0.2
// @description  导出慕课网的笔记，分为点赞和采集两种（本人编写的也会被导出）。导出的格式为json。导出过程可以暂停，下次在进行导出。
// @author       Ming Ye
// @match        http://www.imooc.com/*/*
// @include      https://www.imooc.com/*/*
// @require      https://greasyfork.org/scripts/34143-debug/code/debug.js?version=232648
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
//  @require https://greasyfork.org/scripts/27104-filesaver/code/FileSaver.js?version=173518
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35993/%E6%85%95%E8%AF%BE%E7%BD%91%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/35993/%E6%85%95%E8%AF%BE%E7%BD%91%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var log = window.myDebugger.consoleFactory('慕课网导出笔记脚本:', 'color:brown;font-size:13px'),
        debugTrue = window.myDebugger.debugTrue(true);
    var $btnContainer = $('#main .course-info-main .content-wrap .mod-tab-menu .course-menu'),
        $collectBtn = $('<a id="exportNoteBtn" style="margin:10px;padding:10px;border-radius:5px;background-color:orange;color:white;cursor:pointer;">导出笔记</a>'),//采集按钮
        $exportColCheck = $('<div style="display:inline-block;margin-right:10px"><input type="checkbox" id="exportColCheck"/><span style="color:white;">采集</span>'),
        $exportPraCheck = $('<input type="checkbox" id="exportPraCheck"/><span style="color:white;">点赞</span>'),
        $curPageLabel = $('<p id="curPage" style="margin-top:10px;margin-left:30px;color:white;"><span>当前采集页数:</span><span id="curPageNum">0</span></p>');
    
    $collectBtn.click(btnClickHandler).appendTo($('#main .course-infos .hd'));
    $exportColCheck.appendTo($('#main .course-infos .hd'));
    $exportPraCheck.appendTo($('#main .course-infos .hd'));
    $curPageLabel.appendTo($('#main .course-infos .hd'));
    
    var isPause = true,
        courseId = window.location.pathname.split("/")[2], //课程ID
        baseUrl = window.location.protocol + '//' + window.location.hostname + '/note/' + courseId + '?sort=hot&page=',
        pageNum = localStorage.getItem('pageNum-'+courseId), //笔记页码
        noteTimeout = null,
        userObj = fetchUser().data, //用户对象，保存用户相关信息
        notes = JSON.parse(localStorage.getItem('notes-'+courseId)), //
        isCol = false,//是否收集采集的笔记
        isPra = false;//是否收集点赞的笔记
    log('课程ID', courseId);
    log('基准url', baseUrl);
    pageNum = pageNum ? pageNum : 1;

    /**
     * 导出笔记按钮点击事件
     */
    function btnClickHandler(){
        isPause = !isPause;
        if(isPause){
            $("#exportNoteBtn").text('导出笔记');
            clearTimeout(noteTimeout)
        }else{
            isCol = $('#exportColCheck')[0].checked;
            isPra = $('#exportPraCheck')[0].checked;
            $("#exportNoteBtn").text('暂停导出');
            fetchNote();
        }
    }
    /**
     * 采集笔记
     */
    function fetchNote(){
        var htmlText = $.ajax({
            url: baseUrl + pageNum,
            async: false
        }).responseText;
        //最后导出笔记
        if(htmlText.indexOf('此课程暂无同学记录过笔记')>=0){
            var blob = new Blob([JSON.stringify(notes)], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "notes.json");
            return;
        }

        log('pageNum',pageNum);
        $("#curPageNum").html(pageNum);
        ++pageNum;
        var obj = getNoteElem(htmlText);
        var noteStatus = getUserNoteStatus(obj.noteIds);
        var colObj = getColObj(noteStatus);
        var colIdArr = []; //需要采集的笔记的id数组
        if(isCol){
            colIdArr = colObj.col;
        }else if(isPra){
            for(var i=0,len=colObj.pra.length;i<len;i++){
                colIdArr.push(colObj.pra[i]);
            }
        }
        var dataArr = fetchColContent(colIdArr,obj.noteStrArr);
        
        notes = notes || [];
        for (var i = 0, len = dataArr.length; i < len; i++) {
            notes.push(dataArr[i]);
        }
        log('pageNum',pageNum);
        // debugTrue();
        localStorage.setItem('notes-'+courseId, JSON.stringify(notes));
        localStorage.setItem('pageNum-'+courseId,pageNum);
        //当查询不到笔记容器id表示已经获取完所有的笔记了;
        noteTimeout = setTimeout(fetchNote,100);
        return ;
    }
    
    /**
     * 获取采集对象
     * @param  {array} colArr 采集参照的id数组
     * @return {object}        采集对象
     */
    function fetchColContent(colArr,liStrArr) {
        var retDatas = [];
        for(var i=0,len=colArr.length;i<len;i++){
            var id = colArr[i];
            for(var j=0,len2=liStrArr.length;j<len2;j++){
                var liStr = liStrArr[j];
                if(liStr.indexOf('id="'+id+'"')>=0 || liStr.indexOf('authorid="'+userObj.uid+'"')>=0){
                    var patternNote = /<div class="js-notelist-content notelist-content mynote">[\s\S]*?<pre class="autowrap">([\s\S]*?)<\/pre>/g,
                        patternUser = /<div class="tit">[\s\S]*?<a [\s\S]*? target="_blank">([\s\S]*?)<\/a>/g,
                        patternTime = /<div class="footer clearfix">[\s\S]*?<span [\s\S]*?>时间：([\s\S]*?)<\/span>/g,
                        patternChapter = /<div class="footer clearfix">[\s\S]*?<a [\s\S]*?>源自：([\s\S]*?)<\/a>/g,
                        patternAuthLink = /<div class="media">[\s\S]*?<a href="([\s\S]*?)">/,
                        patternScreenshot = /<div class="js-toggle-notelist answerImg">[\s\S]*?<img [\s\S]*? data-src="([\s\S]*?)"/,
                        patternCourseLink = /<div class="footer clearfix">[\s\S]*?<a href="[\s\S]*?"/g,
                        patternFileId = /<div class="disscus-code-icon-wrap">[\s\S]*?<i class="disscus-code-icon js-show-node-code" data-id="([\s\S]*?)"/g;
                    var noteStr = patternNote.exec(liStr)[1],
                        user = patternUser.exec(liStr)[1],
                        time = patternTime.exec(liStr)[1],
                        chapter = patternChapter.exec(liStr)[1],
                        authLink = window.location.origin + patternAuthLink.exec(liStr)[1],
                        courseLink = window.location.origin + patternCourseLink.exec(liStr)[1],
                        matchScreenshotLink = patternScreenshot.exec(liStr),
                        matchFileId = patternFileId.exec(liStr);
                    var data = {
                        note:noteStr,
                        time:time,
                        user:user,
                        chapter:chapter,
                        authLink:authLink,
                        courseLink:courseLink
                    };
                    //如果存在截图，则获取截图url
                    if(matchScreenshotLink && matchScreenshotLink[1]){
                        data.screenshotLink = window.location.protocol+matchScreenshotLink[1]
                    }
                    //如果存在代码快照，则获取代码快照
                    if(matchFileId && matchFileId[1]){
                        var retStr = $.ajax({
                            url: 'https://www.imooc.com/course/viewnotecode?id='+matchFileId[1],
                            async: false,
                        }).responseText;
                        data.codeFiles = JSON.parse(retStr).files;
                    }
                    log.logObj('data',data);
                    retDatas.push(data);
                }
            }
        }

        log.logArr('fetchColContent', retDatas);
        return retDatas;
    }
    /**
     * 使用jsonp方式获取用户对象,获得对象后保存在window.usr中
     */
    function fetchUser() {
        var retStr = $.ajax({
            url: window.location.protocol+'//www.imooc.com/u/card%20?jsonpcallback=getUser&_=' + new Date().getTime(),
            async: false,
        }).responseText;
        log('fetchUser', retStr);
        retStr = retStr.replace('getUser(', '');
        retStr = retStr.substr(0, retStr.length - 1);
        var usr = JSON.parse(retStr);
        log.logObj('fetchUser', usr);
        return usr;
    }
    /**
     * 获取采集的id数组
     * @param  {object} noteStatus 笔记状态对象
     * @return {object}            返回采集和点赞的数组{col:[],pra:[]}
     */
    function getColObj(noteStatus) {
        var tmp = noteStatus.data.collections,
            retObj = {
                col: [],
                pra: []
            };
        for (var i = 0, len = tmp.length; i < len; i++) {
            retObj.col.push(tmp[i].src_note_id);
        }
        tmp = noteStatus.data.praises;
        for (var i = 0, len = tmp.length; i < len; i++) {
            retObj.pra.push(tmp[i].note_id);
        }
        log.logObj('getColIds', retObj);
        return retObj;
    }
    /**
     * 获取笔记元素的id和字符串数组
     * @return {object} 笔记id和笔记元素字符串数组
     */
    function getNoteElem(htmlText){
        var pattern = /<ul id="js-note-container" class="mod-post">([\s\S]*)?<\/ul>/g;
        var pattern1 = /<li id="([\d]+)" class="post-row js-find-txt" courseid="[\d]+" noteId="[\d]+" authorid="[\d]+">[\s\S]*?<\/li>/g;
        var matchArr = pattern.exec(htmlText),
            liIds = [],
            liStrArr = [],
            regInput = matchArr[0];
        while(matchArr = pattern1.exec(regInput)){
            log.logObj('matchArr',matchArr);
            liIds.push(matchArr[1]);
            liStrArr.push(matchArr[0]);
        }
        log.logObj('liStrArr',liStrArr);
        log.logArr('liIds',liIds);
        return {noteIds:liIds,noteStrArr:liStrArr};
    }
    /**
     * 获取用户笔记状态
     * @param  {array} ids 用户笔记id数组
     * @return {object} 用户笔记操作状态对象
     */
    function getUserNoteStatus(ids) {
        var retStr = $.ajax({
                url: window.location.protocol+'//www.imooc.com/course/AjaxUserNotesStatus?ids=' + ids.join('%2C'),
                async: false
            }).responseText,
            retObj = JSON.parse(retStr);
        log('url',window.location.protocol+'//www.imooc.com/course/AjaxUserNotesStatus?ids=' + encodeURI(ids.join('%2C')));
        log.logObj('getUserNoteStatus', retObj);
        return retObj;
    }
    
})();