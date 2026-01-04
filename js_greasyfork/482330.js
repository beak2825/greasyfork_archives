// ==UserScript==
// @name         教务系统-正方教务系统自动评价
// @namespace    https://www.goldlog.net/
// @version      1.1
// @description  进入正方教务系统评价页面自动加载
// @author       热心网友
// @match        https://*.edu.cn/xspjgl/xspj_cxXspjIndex.html*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482330/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F-%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482330/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F-%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    // 给老师评分的分数 1就是5分
    var pf = "1"
    // 教师评语
    var py = ''

    
    // 评价功能选单注入
    var pj_head = document.querySelector('#kc-head')
    var newCode = '<h3 class="panel-title"><div style="width: 100%;  border: 1px #ccc solid; border-radius: 5px;padding: 10px;margin-top: 10px;"><h4 style="text-align: center;">自动评价功能</h4><br/><label style="width: 50%;" for="auto-pf">评价分数: </label>&nbsp;&nbsp;&nbsp;<select id="auto-sele" style="width: 30%;" name="auto-pf"><option value="1">5</option><option value="2">4</option><option value="3">3</option><option value="4">2</option><option value="5">1</option></select><br><textarea placeholder="输入评语,允许留空" id="auto-py" class="form-control"></textarea><button style="width: 100%;" class="btn btn-default btn-default" id="auto-pj-btn">开始评价</button><br/><p style="color: red;text-align: left;font-size: 12px;">注意: 提交操作需要手动完成</p></div></h3>'; 
    pj_head.insertAdjacentHTML('beforeend', newCode);

    // 选单按钮
    var auto_btn = document.querySelector("#auto-pj-btn"); 
    // 选择分数
    var auto_select = document.querySelector("#auto-sele"); 
    // 评语
    var auto_py = document.querySelector("#auto-py"); 

    
    function check_pf(){
        // 未评分科目
        var wp = document.querySelector('#wp').children[0].innerText
        if(wp == '0'){
            auto_btn.innerText = '已完成评分'
            auto_btn.disabled = true;
            auto_select.disabled = true;
            auto_py.disabled = true;
        }
    }
    
    auto_btn.addEventListener('click', function() {  
        // 没选就默认5分
        if(auto_select.value == '') auto_select.value = '1';
        // 赋值已选分数
        pf = auto_select.value;
        if(auto_py.value != ''){
            py = auto_py.value;
        }
        auto_btn.innerText = '正在评价'
        auto_btn.disabled = true;
        
        mainLoop(pf,py); // 启动主循环
    });

    // 等待300ms让教师列表加载
    setTimeout(()=>{
        // 教师列表改为100每页
        var selbox = document.querySelector(".ui-pg-selbox")
        selbox[0].selected = false
        selbox[6].selected = true
        selbox.dispatchEvent(new Event('change', { bubbles: true }));

        check_pf()
    },300)

    // 创建一个返回 Promise 的延迟函数  
    function delay(ms) {  
        return new Promise(resolve => setTimeout(resolve, ms));  
    }
    
    async function mainLoop(pf,py) {  
        var teac_list = document.querySelectorAll('.jqgrow');  
        for (let i = 0; i < teac_list.length; i++) { 
            
            console.log("当前评价第: " + (i - 0 + 1) + " 个老师"); 
            
            if(teac_list[i].innerHTML.includes('提交')){
                console.log("该教师评价已经提交,跳过")
            }
            await pf_fun(i,pf,py);
            
        }  
        check_pf()
    }  
    

    async function pf_fun(te,pf, py) {  
        console.log("进入评分阶段");
        await delay(1000);  
        var bc_btn = document.querySelector('#btn_xspj_bc');  
        if(bc_btn != null){
            bc_btn.style = 'position: fixed;top: 0;left: 0;width: 100%;height: 100%; background-color: rgba(0, 0, 0, 0.5);color: #fff;display: flex;justify-content: center;align-items: center;font-size: 36px;color: black;';  
            bc_btn.innerText = '正在评价,请勿操作';  
            bc_btn.disabled = true;  
            
            console.log("选中评分");
            var xf = document.querySelectorAll(`.input-xspj-${pf}`);  
            for (let i = 0; i < xf.length; i++) {  
                xf[i].querySelector("input").click();  
            }  
            if (py != '') document.querySelectorAll('.form-control')[1].value = py;
        
            // 使用 await 等待每个 setTimeout 完成  
            await delay(1000);  
            console.log("开启保存按钮");  
            bc_btn.disabled = false;  
          
            await delay(1000);
            console.log("点击保存按钮");  
            bc_btn.click(); 
            bc_btn.disabled = true;  
          
            await delay(1000); // 同上
            document.querySelector('.close').remove();
            console.log("点击确定按钮");  
            document.querySelector('#btn_ok').click();
        }
        
        await delay(1000); // 同上  
        var teac_list = document.querySelectorAll('.jqgrow');  
        if(te == teac_list.length - 1){
            teac_list[0].click()
        }else{
            teac_list[te + 1].click()
        }

        
    }  
})();