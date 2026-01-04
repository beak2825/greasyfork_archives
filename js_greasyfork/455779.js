// ==UserScript==
// @name         消防网络学院考试辅助外挂(第五、六期)
// @namespace    https://cfr.sset.org.cn/
// @version      0.9
// @description  第五、六期
// @author       天王老子
// @match        https://cfr.sset.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sset.org.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license      nadt1988
// @downloadURL https://update.greasyfork.org/scripts/455779/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9%E5%A4%96%E6%8C%82%28%E7%AC%AC%E4%BA%94%E3%80%81%E5%85%AD%E6%9C%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455779/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9%E5%A4%96%E6%8C%82%28%E7%AC%AC%E4%BA%94%E3%80%81%E5%85%AD%E6%9C%9F%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var db;
var db_data;
$(document).ready(function(){
    var study_running=0;
    var exam_url="https://cfr.sset.org.cn/app-yjgb/wechat/#/activity/exam/answer-paper/";
    var exam_answers=[
        {
            id:"b31524bd-ceb1-4291-8ba9-911fdd01457d",
            single:"BBCCCADA",
            multiple:"BCD@CD@ACD",
            choice:"AAA"
        },
        {
            id:"5817870b-741e-4225-9a16-cbeaa24f4fff",
            single:"CCBCADAB",
            multiple:"ABC@ABCD@ACD",
            choice:"AAA"
        },
        {
            id:"90724aec-49a4-4d75-beab-315ba923a254",
            single:"CBDCBBAA",
            multiple:"ABCD@ABC@ABCD",
            choice:"AAB"
        },
        {
            id:"d1bf4bdb-a9c1-4c68-8637-1770b8d57e86",//文物古建筑火灾防治扑救重点难点及对策分析
            single:"ABCACDCD",
            multiple:"ABCD@ABCD@ABCD",
            choice:"AAB"
        },
        {
            id:"10976a64-2986-48c0-baa4-eee234a0a07b",//灾害事故现场侦察的组织与实施
            single:"BAAADACA",
            multiple:"ABD@ABC@ABCD",
            choice:"AAA"
        },
        {
            id:"3db8cf4e-7e53-4b2b-83f5-f6b10a3e0432",//强化联合救援理念、完善救援协调机制，提升重特大森林草原火灾
            single:"CABBAAAB",
            multiple:"AB@ABC@ACD",
            choice:"AAA"
        },//666
        {
            id:"7d8ffc54-579c-4e70-8cd4-1b29eec29ae9",
            single:"BDACBBBB",
            multiple:"ABCD@AB@ABCD",
            choice:"AAA"
        },
        {
            id:"cee600da-e4b5-4416-8a35-a72efbaf93bc",
            single:"CCAABACA",
            multiple:"AB@ABC@ABCD",
            choice:"AAA"
        },
        {
            id:"f4928bbb-3454-4b66-832a-89b457c8b120",
            single:"DDBDABBA",
            multiple:"ABCD@ABC@BC",
            choice:"ABB"
        },
        {
            id:"684a7c31-1a81-4e48-b126-817ff5dbd767",
            single:"BBAAABCC",
            multiple:"ABCD@ABD@ACD",
            choice:"AAA"
        },
        {
            id:"c5333a47-1411-48cc-9469-0c48910256a7",
            single:"CDAAACBA",
            multiple:"ABCD@ABCD@ABD",
            choice:"AAB"
        },
        {
            id:"302ce388-b650-4afd-a571-4e89b1cf0ca9",
            single:"CAABDBAC",
            multiple:"ABC@ABCD@ABCD",
            choice:"AAA"
        }
       
    ];
    //在顶部添加一个div，用户引导用户
    var welcome_div=$("<div id='welcome_div' style='width:120px;;height:30px;background-color:green;position:absolute;top:40px;left:5px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='https://cfr.sset.org.cn/app-yjgb/wechat/#/home/course?homeConfigId=0c179aa1-5a39-4dae-afea-aebb702ae196&name=在线自学&comeFrom=home&icon=false' style='color:yellow'>考试外挂入口</a></div>");
    var checkdiv=$("<div id='getAnswer' style='width:120px;;height:30px;background-color:green;position:absolute;top:40px;left:140px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='javascript:void(0)' style='color:yellow'>获取答案</a></div>");
    $("body").append(checkdiv);
    $("body").append(welcome_div);
    $("#getAnswer").click(function(){
        var url=window.location.href;
        if(url.indexOf("answer-paper")!=-1){
            autoExam(exam_answers,exam_url);
        }else{
            alert("请选择进入考试页面");
        }
    });
});
//indexedDB 数据库操作
function getDB(){
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    if(!indexedDB) {
        console.log("你的浏览器不支持IndexedDB");
        return;
    }
    var requestDB = indexedDB.open('localforage', 2);
    requestDB.onsuccess = function (e) {
        db = e.target.result;
        console.log('数据库打开成功');
        getData();
    };
    requestDB.onerror = function (event) {
        console.log('数据库打开报错');
    };
}

function getData(){
    var transaction = db.transaction(["keyvaluepairs"]) // 事务
    var objectStore = transaction.objectStore("keyvaluepairs") // 仓库对象
    var request = objectStore.get("answer_records");
    request.onerror = function(event) {
        console.log('事务失败')
    }
    request.onsuccess = function(event){
        db_data=request.result;
        updateDB();
    }
}

function updateDB(){
    var records=db_data.records;
    for(var i=0;i<records.length;i++){

    }
    //BBDDABBC
    //ABCD@BCD@ABCD
    var id="answer_records";
    var _data={
        examRecordId:db_data.examRecordId,
        lastCacheTime:db_data.lastCacheTime,
        records:records
    };
    var transaction = db.transaction(["keyvaluepairs"],'readwrite') // 事务
    var objectStore = transaction.objectStore("keyvaluepairs") // 仓库对象
    var request = objectStore.get("answer_records");
    request.onsuccess = function() {
        const objectStoreUpdate = objectStore.put(_data,id)
        objectStoreUpdate.onsuccess = function (e) {
            console.log('update success')
        }
    }
    request.onerror = function() {
        console.log('数据更新失败')
    }
}

function autoExam(exam_answers,exam_url){
    var url=window.location.href;
    var indexs=0;
    for(var i=0;i<exam_answers.length;i++){
        console.log(exam_url+exam_answers[i].id);
        if(url==exam_url+exam_answers[i].id){
            var single_answer=exam_answers[i].single;
            var _multiple_answer=exam_answers[i].multiple;
            var multiple_answer=_multiple_answer.split("@");
            var chioce_answer=exam_answers[i].choice;
            var exambody=$(".type-body");
            //单选
            for(var s=0;s<single_answer.length;s++){
                var _answer=convertWordToInt(single_answer[s]);
                $("#rad"+s+_answer).parent().css("color","red");
                $("#rad"+s+_answer).parent().append("[正确答案]");
                $("#rad"+s+_answer).click();
            }
            //多选
            for(s=0;s<multiple_answer.length;s++){
                var temp=multiple_answer[s];
                for(var t=0;t<temp.length;t++){
                    _answer=convertWordToInt(temp[t]);
                    $("#che"+s+_answer).parent().css("color","red");
                    $("#che"+s+_answer).parent().append("[正确答案]");
                }
            }
            //判断
            for(s=0;s<chioce_answer.length;s++){
                if(chioce_answer[s]=="A"){
                    temp="01";
                }else{
                    temp="02";
                }
                $("#opi"+s+temp).parent().css("color","red");
                $("#opi"+s+temp).parent().append("[正确答案]");
                $("#opi"+s+temp).click();
            }
            break;
        }
        indexs++;
    }
    if(indexs==exam_answers.length){
        alert("暂未找到考试答案，请刷新或者稍后重试！！！");
    }
}

function convertWordToInt(code){
    switch(code){
        case "A":return 0;
        case "B":return 1;
        case "C":return 2;
        case "D":return 3;
    }
}