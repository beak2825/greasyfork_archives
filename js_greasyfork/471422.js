// ==UserScript==
// @name         Get your GPA score
// @namespace    http://stupidsheep.fun/
// @version      0.1
// @description  due to the lack of computing the GPA button in my university's website, I wanna create one.
// @author       Stupidsheep
// @match        https://jwxt.hzu.edu.cn/cjcx/cjcx_cxDgXscj.html?gnmkdm=N305005&layout=default*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hzu.edu.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471422/Get%20your%20GPA%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/471422/Get%20your%20GPA%20score.meta.js
// ==/UserScript==

(function() {

    'use strict';
    // unused layout
    let scoreLayout1 = `
      <div class="col-md-3 col-sm-6 nihao">
    <div class="form-group">
        <label for="" class="col-sm-4 control-label">点击查看成绩</label>
    </div>
</div>
    `;
    // 显示绩点的html框架
    // 为了保持样式统一，所以直接复制一份相同html框架来改
    let scoreLayout2 = `
    <div class="col-md-3 col-sm-6 nihao">
    <div class="form-group">
        <label for="" class="col-sm-4 control-label">平均学分绩点</label>
        <div class="col-sm-8">
            <div
                class="chosen-container chosen-container-single chosen-container-single-nosearch"
                style="width: 100%; z-index: 1010"
                title=""
                id="kcbjdm_cx_chosen"
            >
                <a class="chosen-single" tabindex="-1"><span>点击上方按钮查看成绩</span></a>
            </div>
        </div>
    </div>
</div>
`;
    // 查询平均绩点按钮的html框架。
    let computeBtnLayout = `
    <div
    class="btn-toolbar"
    role="toolbar"
    style="margin-left: 20px; float: right; z-index: 1050"
>
    <div class="btn-group" id="but_ancd">
        <button type="button" class="nihao-btn btn btn-default btn_dc" id="btn_dc">
            <i class="bigger-100 glyphicon glyphicon-export"></i>
            查看平均学分绩点
        </button>
    </div>
</div>
`;
    // 将计算绩点按钮插入到页面。
    let compute_btn_pos = document.querySelector("#innerContainer .sl_add_btn .col-sm-12 .col-sm-12.col-lg-12.col-md-12");
    compute_btn_pos.insertAdjacentHTML("afterbegin", computeBtnLayout);
    // 请求其他成绩按钮
    let search_go_btn = document.querySelector("#search_go");
    // 计算的按钮
    let compute_btn = document.querySelector(".nihao-btn ");
    // 将显示绩点的整体元素插入到页面。
    let navigators = document.querySelectorAll("#searchForm .row .col-md-3.col-sm-6");
        navigators[navigators.length - 1].insertAdjacentHTML("afterend", scoreLayout2)
    // 针对绩点分数的显示的切换
    let score = document.querySelector(".nihao .form-group  .col-sm-8 #kcbjdm_cx_chosen a span");
    // 每次请求新成绩，则更新一次分数。
    search_go_btn.addEventListener("click", () =>{
          console.log(score);
         score.textContent = "点击上方按钮查看成绩";
    });
    // 计算GPA的方法
    let computedGPA = () =>{
        let table_cells = document.querySelectorAll("#tabGrid tr td");
        // 主要方法为：GPA=∑课程学分绩点÷∑课程学分
        let courseGradePoints = 0; // 课程学分绩点
        let totalCourseCredits = 0; // 课程总学分
        table_cells.forEach((item) =>{
            if(item.getAttribute("aria-describedby") === "tabGrid_xfjd"){
               courseGradePoints += Number(item.textContent);
                console.log("tmp1 = ", item.textContent);
            }else if(item.getAttribute("aria-describedby") === "tabGrid_xf"){
                totalCourseCredits += Number(item.textContent);
                console.log("tmp2 = ", item.textContent);
            }
        })
        console.log(courseGradePoints);
        console.log(totalCourseCredits);
        let ans = (courseGradePoints/ (totalCourseCredits * 5)* 5).toFixed(2);
        score.innerHTML = ans;
    }
    // 点击查看后调用函数。
    compute_btn.addEventListener("click", () =>{
        computedGPA();
        console.log("show success");
    })
})();