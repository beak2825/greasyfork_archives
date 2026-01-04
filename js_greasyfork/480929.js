// ==UserScript==
// @name         智能导服刷会话数量
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.0
// @description  智能导服刷会话数量,分云客服端和用户端。点击右键前往更新
// @author       大魔王
// @match        *zndf.linyi.gov.cn*

// @downloadURL https://update.greasyfork.org/scripts/480929/%E6%99%BA%E8%83%BD%E5%AF%BC%E6%9C%8D%E5%88%B7%E4%BC%9A%E8%AF%9D%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/480929/%E6%99%BA%E8%83%BD%E5%AF%BC%E6%9C%8D%E5%88%B7%E4%BC%9A%E8%AF%9D%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var maxNum=0;//设置的最大运行次数,不设置的话默认一直执行，直到手动停止
    var count=0;//当前运行次数 点击结束时归0    

    importDiv();
    function main(){ 
        if(count>=maxNum && maxNum!=0){//如果超出最大运行次数
            count =0;
            document.querySelector('#otBtnDiv').textContent = count+'/'+(maxNum==0?'∞':maxNum);

           // return ;
        } 
        
        let btn = document.querySelector('#startDiv');
        if(location.pathname=='/p/dsm-plugin-uk/admin/csr'){
            console.log('云客服端');
            if(btn.value == 'stop'){//运行中
                
                Ystart();
            }else{
                count=0;//自动停止后，重置计数器
                return;
            }
            
            
        }else if(location.pathname=='/p/dsm-plugin-uk/im/1ha4ar'){
            console.log('用户端');
            if(btn.value == 'stop'){//运行中
                Kstart();
            }else{
                return;
            }
        }else {
            btn.textContent = '▶';
            btn.value = 'start'; 
        }
    }
    

    
    //*********云客服端函数begnin***************** */
    function Ymain(){//云客服端
        let startDiv = document.querySelector('#startDiv');
        if(startDiv.value =='start')//开关
            return;
        
        //一下为具体业务函数
        if(isOpenWindow()){
            console.log('发送会话');
            setText('您好，请问有什么可以帮您？');//测试时屏蔽
            setTimeout(function(){
                document.querySelectorAll('.el-button.el-button--primary.el-button--small')[2].click();//发送
                setTimeout(function(){
                    console.log('关闭会话');
                    document.querySelector('.el-button.el-button--danger.el-button--small').click();//关闭              
                    
                    setTimeout(function(){
                        document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary ').click();//确认关闭按钮
                        //document.querySelector('.el-button.el-button--default.el-button--small').click();//测试用，取消按钮
                        //运行次数
                        document.querySelector('#otBtnDiv').textContent = count+1+'/'+(maxNum==0?'∞':maxNum);
                        if(!isNumRun()){
                            console.log('运行次数完成，脚本自动停止运行   maxNum:',maxNum,',count:',count);                                                      
                            return;
                        }
                        setTimeout(function(){
                            Ymain();
                        },2000);
                        
                    },500);

                },500);

            },500);
            
            
            
            
        }else{
            setTimeout(function(){
                console.log('暂无会话，持续监控');
                Ymain();
                return;
            },1000);
        }
    }
    function setText(str){//发送欢迎语
        let settext = document.querySelector('iframe').contentDocument.body;
        settext.focus();
        settext.textContent = str;
        
    }
    function isOpenWindow(){//判断是否有会话窗口
        let opWin = document.querySelector('.convo-box.ml-16');
        //console.log('opWin',opWin);
        if(!opWin){
            setTimeout(function(){
                isOpenWindow();
                return;
            },200);
        }else  if(!opWin.style.display){//有会话窗口
            console.log('检测到会话窗口');
            return true;
        }
        return false;
    }
    //******云客服函数end */
    //***客户端函数begin */
    function Kmain(){//用户端
        let startDiv = document.querySelector('#startDiv');
        if(startDiv.value =='start')//开关
            return;
        
        //具体业务逻辑
        if(isWinEnd()){//会话结束，重新发起会话
            console.log('检测到会话结束，重新发起会话');
            setTimeout(function(){
                
                //运行次数
                document.querySelector('#otBtnDiv').textContent = count+1 +'/'+(maxNum==0?'∞':maxNum);
                if(!isNumRun()){
                    console.log('运行次数完成，脚本自动停止运行   maxNum:',maxNum,',count:',count);                                       
                    return;
                }
                
                //document.querySelector('.btn.active').click();//测试时屏蔽
                setTimeout(function(){
                    Kmain();
                },2000);
            },800);
            
        }else{
            setTimeout(function(){
                console.log('持续监控中……');
                Kmain();
            },2000);

        }
        
    }
    function isWinEnd(){//获取会话并判断会话是否结束
        let msg = document.querySelectorAll('.message.content');
        //console.log(msg[msg.length-1].textContent);
        if(msg[msg.length-1].textContent =='会话已结束，感谢您的咨询！'){
            return true;
        }
        return false;
    }

    /***客户端函数end */

    function isNumRun(){
        //运行次数判定，是否继续运行脚本  true:运行   false:停止
        let startDiv = document.querySelector('#startDiv');
        count++;
        console.log('maxNum:',maxNum,',count:',count);
        if(count>=maxNum && maxNum!=0){//如果超出最大运行次数
            startDiv.value =='start';
            startDiv.textContent = '▶';
            return false;
        } 
        
        return true;
    }


    function Ystart(){
        console.log('this is Ystart,将调用Ymain');
        Ymain();
        
    }
    function Kstart(){
        console.log('this is Kstart,将调用Kmain');
        Kmain();
    }

    function importDiv(){//插入控制按钮
        let isDiv = document.querySelector('#startDiv');
        
        if(isDiv){
            return;
        } 
        
        let startDiv = document.createElement("div");
            startDiv.id = "startDiv";            
            startDiv.textContent = "▶";
            startDiv.value = "start";
            startDiv.title = '左键点击开始/结束脚本，右键点击前往更新';
            startDiv.style = `
                            /**opacity:0.2 ;*透明度*/
                            /*display: none;*/
                            position: fixed;
                            right: 5px;
                            bottom: 50px;
                            z-index: 2247483648;
                            padding: 20px 5px;
                            width: 50px;
                            height: 20px;
                            line-height: 5%;
                            text-align: center;
                            border: 1px solid;
                            border-color: #888;
                            border-radius: 50%;
                            background: #efefef;
                            cursor: pointer;
                            font: 12px/1.5 
                        `;
            document.body.appendChild(startDiv);
            startDiv.addEventListener('click',function(){
                if(this.value == 'start'){
                    this.textContent = '■';
                    this.value = 'stop';                    
                }else{
                    this.textContent = '▶';
                    this.value = 'start';
                    return;
                }
                main();
                
            });
            
            startDiv.addEventListener('contextmenu', function(event) {//右键
                event.preventDefault(); // 阻止默认菜单
                console.log('右键点击事件触发了');
                let updataUrl = 'https://greasyfork.org/zh-CN/scripts/480929-%E6%99%BA%E8%83%BD%E5%AF%BC%E6%9C%8D%E5%88%B7%E4%BC%9A%E8%AF%9D%E6%95%B0%E9%87%8F';
                window.open(updataUrl,'_blank');
            });


            //另一个按钮
            let otBtn = document.createElement("div");;
            otBtn.id = 'otBtnDiv';
            otBtn.style =  `
                            /**opacity:0.2 ;*透明度*/
                            /*display: none;*/
                            position: fixed;
                            right: 5px;
                            bottom: 100px;
                            z-index: 2247483648;
                            padding: 20px 5px;
                            width: 50px;
                            height: 20px;
                            line-height: 5%;
                            text-align: center;
                            border: 1px solid;
                            border-color: #888;
                            border-radius: 50%;
                            background: #efefef;
                            cursor: pointer;
                            font: 12px/1.5 
                        `;
            otBtn.textContent = "0/∞";
            otBtn.value = "otBtn";
            otBtn.title = '当前运行次数/最大运行次数';
            document.body.appendChild(otBtn);
            otBtn.addEventListener('click',function(){
                //设定运行次数
                count=0;
                let uNum = prompt(`请输入运行次数，输入≤0的数字为无限运行`,"").trim();
                let judgeFn = new RegExp(/\s+/g);
                if (judgeFn.test(uNum)) {
                    alert("内容包含有空格!");
                    return;
                }
                console.log('uNum:',uNum);
                if (uNum!=null && uNum!=""){
                    //
                    if(uNum<=0){
                        uNum = 0;
                    }
                    maxNum = uNum;
                    this.textContent = count+'/'+(maxNum==0?'∞':maxNum);
                }else{
                    count =0;
                    this.textContent = count+'/'+(maxNum==0?'∞':maxNum);
                }

            });
    }
    
})();