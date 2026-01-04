// ==UserScript==
// @name         广西医科大学评教辅助
// @version      0.3.2
// @description  广西医科大学评教辅助，自动逐个给每个老师评98分。作者不为使用者行为负责。
// @author       Jamaskii
// @match        http://210.36.48.43/new/student/rank/evaluate2.jsp*
// @match        http://210.36.48.43/new/student/lzdx_rank/lzdx_evaluate.jsp?*
// @icon         http://210.36.48.43/images/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/749710
// @downloadURL https://update.greasyfork.org/scripts/456114/%E5%B9%BF%E8%A5%BF%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/456114/%E5%B9%BF%E8%A5%BF%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function(){
    'use script';

    let panel=document.createElement('div');

    let boxInit=document.createElement('div');

    let boxHelper=document.createElement('div');
    let boxInfo=document.createElement('div');
    let boxScore=document.createElement('div');
    let boxControl=document.createElement('div');
    let btnControl=document.createElement('button');
    let selScore=document.createElement('select');

    //初始化界面
    boxInit.innerText='加载中...';

    //辅助主界面
    boxHelper.style='display: none;';
    //评教信息
    boxInfo.style='text-align: center; padding: 0px 5px;';
    //评教分数选择
    selScore.innerHTML='<option>98分</option><!--<option>100分</option><option>随机98或100分</option>--!>';
    selScore.style='font-size:12px; width: 115px; height:20px; padding:2px 4px; margin: 0px;';
    boxScore.innerHTML='给所有老师评：</br>';
    boxScore.style='border-right: 1px dashed black; border-left: 1px dashed black; padding: 8px 5px;';
    boxScore.appendChild(selScore);
    //控制区域
    btnControl.innerText='开始';
    btnControl.style='width: 50px; height: 100%;';
    btnControl.onclick=control;
    boxControl.appendChild(btnControl);
    boxControl.style='padding: 0px 5px';

    //添加元素
    boxHelper.appendChild(boxInfo);
    boxHelper.appendChild(boxScore);
    boxHelper.appendChild(boxControl);
    panel.style='float:right; z-index:9999999; height: 57px; border: 1px dashed black; text-align: center; margin: 0px 200px auto auto; text-align: center;';
    panel.appendChild(boxInit);
    panel.appendChild(boxHelper);
    document.body.appendChild(panel);

    var teachers;
    var looping=false;
    function control(){
        if(btnControl.innerText=='开始'){
            if(teachers.length==teachers.countDone()){
                alert('所有教师都已评教完毕啦！');
            }
            else{
                btnControl.innerText='停止';
                teachers[0].evaluate();
                looping=true;
            }
        }else{
            looping=false;
            btnControl.innerText='开始';
        }
    }

    // 获取当前列表里的教师
    function updateData(){
        //清空数组
        teachers=[];
        //实现完成计数方法
        teachers.countDone=()=>{
            let done=0;
            for(let i=0;i<teachers.length;i++){
                if(teachers[i].done){ done++; }
            }
            return done;
        };
        //获取表格中所有的行
        let items=document.getElementsByTagName('tr')
        //遍历每行，跳过表头
        for(let i=1;i<items.length;i++){
            let teacher={};
            //检查是否已评过
            teacher.done=items[i].outerText.indexOf('未评价')==-1;
            //获取评价按钮事件
            let as=items[i].getElementsByTagName('a');
            for(let j=0;j<as.length;j++){
                if(as[j].outerText=='评价'){
                    teacher.evaluate=as[j].onclick;

                }
            }
            //加入到数组中
            teachers.push(teacher);
        }
        boxInfo.innerHTML='总数：'+teachers.length+'</br>已完成：'+teachers.countDone();
        console.log('teachers:')
        console.dir(teachers);
    }

    //生成随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            default:
                return 0;
        }
    }

    //监听表格内容改变
    var first=true;
    var trigger=false;
    (function(){
        var listView=document.getElementById('pjkc');
        function listViewCallback(mutationsList, observer) {
            mutationsList.forEach((mutation) => {
                if(mutation.type=='childList'){
                    if(first){
                        boxHelper.style='display: block; display: flex; flex-direction: row; align-items:center; font-size: 13px;';
                        boxInit.style.display='none';
                        first=false;
                    }
                    updateData();
                    if(looping && trigger){
                        trigger=false;
                        setTimeout(teachers[0].evaluate, 1000);
                    }
                }
            });
        }
        //开始监听
        var mutationObserver = new MutationObserver(listViewCallback);
        var options = { 'childList': true };
        mutationObserver.observe(listView, options)
    })();


    //监听评教完成对话框的显示并将其隐藏
    (function(){
        var hidden=false;
        var finishDlg=document.getElementById('finishDlg');
        function finishDlgCallback(mutationsList, observer) {
            if(hidden)return;
            for (var i = 0; i < mutationsList.length; i++) {
                //若评价对话框由隐藏转变为显示
                if (mutationsList[i]['attributeName'] == 'aria-hidden' && finishDlg.getAttribute('aria-hidden') == 'false') {
                    let divs=document.getElementsByTagName('div');
                    for(let i=0; i<divs.length; i++){
                        if(divs[i].className=='modal-scrollable' || divs[i].className=='modal-backdrop fade in'){
                            divs[i].style.display='none';
                            hidden=true;
                        }
                    }
                }
            }
        }
        //开始监听
        var mutationObserver = new MutationObserver(finishDlgCallback);
        var options = { 'attributes': true };
        mutationObserver.observe(finishDlg, options)
    })();

    //监听评教表格的显示并将“评98分”的按钮加入
    var added = false;//“评98分”按钮已被渲染到对话框的标记
    var trainer;
    (function(){
    //获取评价对话框
    var evalDlg = document.getElementById('evaluateDlg');
    function callback(mutationsList, observer) {
        for (var i = 0; i < mutationsList.length; i++) {
            //若评价对话框由隐藏转变为显示
            if (mutationsList[i]['attributeName'] == 'aria-hidden' && evalDlg.getAttribute('aria-hidden') == 'false') {
                if(!added){
                    //创建“评98分”按钮，设置样式
                    trainer = document.createElement('button');
                    trainer.className = 'btn blue';
                    trainer.style = 'float:right;margin-right: 20px;';
                    trainer.innerText = '评98分';
                    //该按钮功能为选择固定选项使总分为98分，并在选完后提交
                    trainer.onclick = function () {
                        var lis = document.getElementsByTagName('li');
                        var dxts = [];
                        for (var k = 0; k < lis.length; k++) {
                            if (lis[k].className == 'dxt') {
                                dxts.push(lis[k]);
                            }
                        }
                        let issue = randomNum(0, 9);
                        for (var j = 0; j < dxts.length; j++) {
                            var label = dxts[j].getElementsByTagName('label')[j == issue ? 1 : 0];
                            label.click();
                        }
                        var submit = document.getElementById('pjsubmit');
                        setTimeout(submit.click(), 400);
                    }
                    //将该按钮渲染到对话框头部
                    var head = evalDlg.getElementsByTagName('h4')[0];
                    head.appendChild(trainer);
                    //按钮已被渲染到对话框的标记
                    added = true;
                }

                if(looping){
                    setTimeout(()=>{
                        trainer.onclick();
                        trigger=true;
                    }, 500);
                }
            }
        }
    }
    //开始监听
    var mutationObserver = new MutationObserver(callback);
    var options = { 'attributes': true };
    mutationObserver.observe(evalDlg, options);
    })();

})();