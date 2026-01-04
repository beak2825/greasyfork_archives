// ==UserScript==
// @name         CorpFe Helper
// @namespace    http://ctripcorp.bff.com/
// @version      0.5
// @description  用于对公司一些工具，提供扩展，用于提升使用体验和工作效率
// @author       zh.zhao
// @match        http://es.ops.ctripcorp.com/
// @match        http://idev.ctripcorp.com/resources/team
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctripcorp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456885/CorpFe%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/456885/CorpFe%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("插件开始运行")
    window.onload = subSomething;//当页面加载状态改变的时候执行这个方法.
    function subSomething()
    {
        if(document.readyState == "complete"){ //当页面加载状态为完全结束时进入
            //你要做的操作。
            var checkNums = 6;
            var interval = 2000;
            for(let i =0;i< checkNums;i++){
                setTimeout(function(){
                    if(document.URL.indexOf("http://es.ops.ctripcorp.com/#/dashboard/elasticsearch/")>=0){
                        // 针对kibana看板放置相关按钮
                        if(document.getElementById("expandAll")) return
                        var kibana_panel = _getKibanaTalbePanel()
                        if(kibana_panel){
                            _setupKibanaTablePanel(kibana_panel)
                            _setupKibanaIntervalCheck()
                            document.getElementById("expandAll").onclick = kibanaExpandAll
                            document.getElementById("collapseAll").onclick = kibanaCollapseAll
                            console.log("插件已启动")
                        }
                    }else if(document.URL.indexOf("http://idev.ctripcorp.com/resources/team")>=0){
                        if(document.getElementById("teamViewBffOnly")) return
                        var idev_team_panel = _getIdevTeamTalbePanel()
                        if(idev_team_panel){
                            _setupIdevTeamTablePanel(idev_team_panel)
                            document.getElementById("teamViewBffOnly").removeEventListener('click', function(){});
                            document.getElementById("teamViewBffOnly").addEventListener('click', function() {
                                // 在这里编写点击事件的处理逻辑
                                _doIdevTeamFilter('BFF')
                            });
                        }
                    }
                }, i * interval)
            }
        }
    }


    function _getIdevTeamTalbePanel(){
        return document.querySelector('div > main > div.mainWrap--JL03E > div > div > div > div.content---qrmH')
    }

    function _setupIdevTeamTablePanel(panel){
        var panels = _findIdevTeamTalbePanel()
        if(panels&&panels.length>0){
            for(var i in panels){
                panels[i].insertAdjacentHTML('beforebegin','<div><button type="button" class="ant-btn ant-btn-default button--6LVN0" id="teamViewBffOnly"><div class="export--oycYD" style="color: blue;">仅看BFF</div></button></div>')
            }
        }
    }

    function _findIdevTeamTalbePanel(){
        var nodes = document.querySelectorAll('div > main > div.mainWrap--JL03E > div > div > div > div.content---qrmH > div:nth-child(1) > div:nth-child(3) > div.right--oYEen > div:nth-child(1)')
        var tablePanels = []
        for(var node in nodes){
            if(nodes[node] && nodes[node].innerHTML){
                tablePanels.push(nodes[node]);
            }
        }
        return tablePanels
    }

    function _doIdevTeamFilter(team){
        var nodes = document.querySelectorAll('div > main > div.mainWrap--JL03E > div > div > div > div.content---qrmH > div.table--CQP2y > div > div > div > table > tbody > tr')
        var isHidden = false
        var btnEle = document.querySelectorAll("#teamViewBffOnly > div")[0]
        if(btnEle.innerText == "仅看BFF"){
            isHidden = true
            btnEle.innerText = "仅看机票BFF"
        }else if(btnEle.innerText == "仅看机票BFF"){
            isHidden = true
            team = "机票-BFF"
            btnEle.innerText = "仅看酒店BFF"
        }else if(btnEle.innerText == "仅看酒店BFF"){
            isHidden = true
            team = "酒店-BFF"
            btnEle.innerText = "仅看地面BFF"
        }else if(btnEle.innerText == "仅看地面BFF"){
            isHidden = true
            team = "地面-BFF"
            btnEle.innerText = "仅看基础BFF"
        }else if(btnEle.innerText == "仅看基础BFF"){
            isHidden = true
            team = "基础-BFF"
            btnEle.innerText = "显示全部"
        }else{
            isHidden = false
            btnEle.innerText = "仅看BFF"
        }
        for(var node in nodes){
            if(nodes[node] && nodes[node].innerHTML && nodes[node].childNodes && nodes[node].childNodes.length>0){
                // console.info(nodes[node].childNodes[0].innerText)
                // document.querySelectorAll('div > main > div.mainWrap--JL03E > div > div > div > div.content---qrmH > div.table--CQP2y > div > div > div > table > tbody > tr')[0].childNodes[0].innerText
                if(!_isUserInTeam(nodes[node].childNodes[0].innerText, team)){
                    nodes[node].hidden = isHidden
                }else{
                    nodes[node].hidden = !isHidden
                }
            }
        }
    }

    function _isUserInTeam(user,team){
        var team_mapping= {"skl孙康隆":"MICE","xzs徐正顺":"MICE","zxt章晓天":"MICE","cf程芳":"MICE","xwt谢文涛":"酒店-BFF","mjl马均龙":"酒店-BFF","zyp郑毓鹏":"酒店-BFF","wzc王卓程":"酒店-BFF","lrt吕瑞亭":"酒店-BFF","ghh顾海鸿":"酒店-BFF","yfx于法兴":"酒店-BFF","xht徐海涛":"机票-BFF","lz刘铮":"酒店-BFF","mjj梅加江":"酒店-BFF","zl张龙":"酒店-BFF","hx黄晓":"酒店-BFF","zk朱坤":"酒店-BFF","wpx王鹏霄":"机票-BFF","tq涂骐":"机票-BFF","lhw刘厚伟":"机票-BFF","xc邢策":"机票-BFF","mn毛宁":"机票-BFF","brr白锐荣":"机票-BFF","wbj汪本骏":"机票-BFF","fpf樊鹏飞":"机票-BFF","why魏昊阳":"机票-BFF","lx刘行":"机票-BFF","zy周杨":"机票-BFF","nxh聂晓晗":"机票-BFF","wll王亮亮":"基础-BFF","xlj辛令剑":"基础-BFF","sh沈慧":"基础-BFF","czm陈中民":"基础-BFF","clb巢李冰":"基础-BFF","cr陈锐":"基础-BFF","byk薄宇鲲":"基础-BFF","zzh赵振海":"基础-BFF","wry王仁义":"基础-BFF","tmm唐明明":"基础-BFF","zsw张士维":"地面-BFF","dgx戴国肖":"地面-BFF","tl唐露":"地面-BFF","kdd柯冬冬":"机票-BFF","dqk董乾坤":"地面-BFF","yjh杨家豪":"地面-BFF","wzf吴自富":"地面-BFF","xj徐杰":"地面-BFF","wmf王梦帆":"地面-BFF","qja秦江安":"地面-BFF","hy胡毅":"","szw孙振维":"","wml王美玲":"","cjy陈剑影":"","wjs王劲松":"","wzy王志远":"","shh沈和和":"","zhc朱宏超":"","zy朱勇":"","phy彭海洋":"","nby宁碧瑶":"","zj朱静":"","czt陈展腾":"","ww魏葳":"","zle张丽娥":"","mwh缪文辉":"","hfl韩飞龙":"","yzk杨之恺":"","wjn王迦南":"","wzg王志刚":"酒店-BFF","yx颜鑫":"","zgy朱改艳":"","sxl孙晓磊":"","xk许葵":"","hxa宦兴安":"","chw陈慧文":"","cyr陈韵如":"","zwb张文彬":"","xyb邢毅彪":"","zhc邹禾灿":"","www王雯雯":"","wmy吴梦瑶":"","bgj包国杰":"","cxt曹向陶":"","zx张啸":"","cj陈健":"","pjr潘建荣":"","ph彭涵":"","hmm胡明明":"","wmd王敏东":"","zh张恒":"","jh江海":"","lll刘亮亮":"","cnn车楠楠":"","cln陈林楠":"","cyl陈燕玲":"","fsl付四林":"","wgj吴国俊":"","zrp张瑞萍":"","cwx陈维迅":"","zjt郑钧泰":"","ycx闫春霞":"","rcq阮成庆":"","zzr张泽人":"","gxx桂孝孝":"","zxx张晓潇":"","xyh夏炎黄":"","bh柏晗":"","zpp钟佩佩":"","zk郑科":"","cyx陈宇翔":"","pjx浦锦霞":"","lx李雪":"","wjw王佳伟":"","gsf顾沈丰":"","lsw刘世文":"","qx秦侠":"","wdd王丹丹":"","zy周洋":"","sty沈天宇":"","fgy冯贵阳":"","fj樊杰":"","zzy周子钰":"","lt龙腾":"","xwh徐文华":"","hly何立鹰":"","tx陶鑫":"","ly罗晔":"","zm张曼":"","zyf张云峰":"","zj张瑾":"","syl宋移琳":"","hp胡鹏":"","yjz余嘉桢":"","yc宇超":"","lxr吕昕芮":"","xh向虹":"","fsq费抒青":"","wsw吴士伟":"","dq代倩":"","zyf张炎非":"","cy崔雨":"","aqq艾钱钱":"","lwh李文浩":"","lz林镇":"","xj许洁":"","zsy周思月":"","xhj夏海金":"","msc马舒岑":"","cxh陈啸寒":"","jgl金国龙":"","zwj张伟杰":"","xpc谢璞淳":"","dyp董易平":"","mqh孟庆昊":"","cyp陈宇鹏":"","zwf赵文芳":"","lj柳娟":"","dc杜超":"","ygh叶光恒":"","mdk马登科":"","cxj陈小镜":"","hq韩青":"","wzl王泽磊":"","yg杨根":"","wz汪政":"","lx陆骧":"","jq江其":"","xyz徐永珍":"","fxy方学源":"","wmm温明明":"","zhc郑海川":"","lq李倩":"","lf李帆":"","ws吴帅":"","dhm杜慧敏":"","zcd张昌达":"","stt沈婷婷":"","jy姜洋":"","why王浩羽":"","lxx刘鑫鑫":"","lx刘晓":"","zzx郑宗旭":"","zyx周奕星":"","cxb陈小波":"","yj杨杰":"","ry荣煜":"","zhb张海波":"","wzp王志鹏":"","hst黄书珽":"","zjw朱俊文":"","xrq肖若琼":"","mc马超":"","gyb桂燕兵":"","ckk陈克克":"","lmy卢敏燕":"","tcj唐成骏":"","tss陶素素":"","lyy李尧尧":"","fwx冯炜馨":"","sdx石东欣":"","lzx刘泽昕":"","lq李群":"","myt马耀婷":"","zll张利利":"","lzq陆子琦":"","zq张倩":"","hk黄凯":"","rfx荣风翔":"","xf肖帆":"","tzs田振山":"","lqq李琴庆":""}
        var user_team = team_mapping[user]
        return user_team && user_team.indexOf(team)>=0
    }


    function _getKibanaTalbePanel(){
        return document.querySelector('body > div:nth-child(9) > div.container-fluid.main.ng-scope > div > div > div > div > div.ng-scope > div.panel.nospace.ng-scope.ng-pristine.ng-valid.ui-resizable.ui-droppable > div > div.ng-scope > div.panel-header > div.row-fluid.panel-extra > div')
    }

    function _setupKibanaTablePanel(panel){
        var panels = _findKibanaTalbePanel()
        if(panels&&panels.length>0){
            for(var i in panels){
                panels[i].insertAdjacentHTML('beforebegin','<div><span style="float: right;background-color: #EDEDED;  color: #FA0720;  border: 1px solid #6D6D6D;  font-size: 17px;  cursor: pointer;  border-radius: 3px;  text-shadow: 0px 0px 2px #FFFF12;  box-shadow: 2px 2px 4px #9E9E9E;margin-right: 10px;padding: 8px;"><span ><i id="expandAll" title="">展开所有</i></span></span></div><div><span style="float: right;background-color: #EDEDED;  color: #FA0720;  border: 1px solid #6D6D6D;  font-size: 17px;  cursor: pointer;  border-radius: 3px;  text-shadow: 0px 0px 2px #FFFF12;  box-shadow: 2px 2px 4px #9E9E9E;margin-right: 10px;padding: 8px;"><span ><i id="collapseAll" title="">折叠所有</i></span></span></div>')
            }
        }
    }


    // 定时刷新messageId字段，如果未添加超链接的，添加超链接
    function _setupKibanaIntervalCheck(){
        setInterval(function(){
            var messageIdNodes = document.querySelectorAll('body > div > div.container-fluid.main.ng-scope > div > div > div > div > div.ng-scope > div.panel.nospace.ng-scope.ng-pristine.ng-valid.ui-resizable.ui-droppable > div > div.ng-scope > div.panel-content > div > div.table-doc-table.table-main > div > table > tbody > tr.ng-scope > td > table > tbody > tr > td:nth-child(1)')
            if(!messageIdNodes) return
            for(let node of messageIdNodes){
                if(node.innerText != "messageId") continue
                var messageId = node.parentNode.childNodes[8].innerHTML
                if(messageId.indexOf("<a") >=0) continue
                node.parentNode.childNodes[8].innerHTML = "<a href='http://bat.fx.ctripcorp.com/logview/" + messageId + "' target='_blank'>"+messageId+"</a>"
            }
        },1500)
    }


    function _findKibanaTalbePanel(){
        var nodes = document.querySelectorAll('body > div:nth-child(9) > div.container-fluid.main.ng-scope > div > div > div')
        var tablePanels = []
        for(var node in nodes){
            if(nodes[node] && nodes[node].innerHTML && nodes[node].innerHTML.indexOf("chtable")>=0){
                tablePanels.push(nodes[node]);
            }
        }
        return tablePanels
    }

    function _getTablePanelRows(){
        return document.querySelectorAll('body > div > div.container-fluid.main.ng-scope > div > div > div > div > div.ng-scope > div.panel.nospace.ng-scope.ng-pristine.ng-valid.ui-resizable.ui-droppable > div > div.ng-scope > div.panel-content > div > div.table-doc-table.table-main > div > table > tbody > tr')
    }

    function kibanaExpandAll(){
        doKibanaExpandOrCollapseTable(true)
    }
    function kibanaCollapseAll(){
        doKibanaExpandOrCollapseTable(false)
    }

    function doKibanaExpandOrCollapseTable(isExpand){
        var rows = _getTablePanelRows()
        if(!rows) return
        for(var row of rows){
            if((row && row.childNodes&&row.childNodes.length<5 ) || !row.childNodes) continue
            if(isExpand && row.parentNode.childNodes.length==5) row.childNodes[4].click()
            else if(!isExpand && row.parentNode.childNodes.length==7) row.childNodes[4].click()
        }
    }

})();