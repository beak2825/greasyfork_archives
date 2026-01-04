// ==UserScript==
// @name         UCAS Class Enrollment Assistant
// @version      1.7.2
// @description  这是一个方便抢课界面操作的辅助工具。包括的功能有：1. 🚪直达战场： 进入选课系统后，自动跳转到选课页面。（如需查看通知公告 需要临时把本工具禁用） 2. 🚀一键跳转： 点击小火箭，想去哪里点哪里！更有高亮与自动滚动，帮助快速定位课程。 3. ✔快速提交： 不想滚到底部才能提交选课？验证码和提交选课按钮直接整合到面板！ 3.1. 选课、学位课复选框添加到面板中； 3.2. 修复了原版选课系统点击"切换验证码"没反应的bug，现在可以点击验证码图片更新没有加载出来的验证码了； 3.3. 提交选课时自动跳过"确认提交吗"对话框。 4. 🎨标注课程状态： 绿色表示已选上的课程，红色表示已满员的课程。（只有进入选课页面才会更新课程是否已满员）
// @author       bazingaW
// @namespace    https://github.com/bazingaW/ucas_class_enrollment_assistant
// @match        http*://jwxk.ucas.ac.cn/*
// @match        http*://jwxkts2.ucas.ac.cn/*
// @icon         https://sep.ucas.ac.cn/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/draggable@4.2.0/src/draggable.js
// @require      https://cdn.jsdelivr.net/npm/jquery-throttle-debounce@1.0.0/jquery.ba-throttle-debounce.min.js
// @run-at document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468185/UCAS%20Class%20Enrollment%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/468185/UCAS%20Class%20Enrollment%20Assistant.meta.js
// ==/UserScript==

var config = {
  'wishList': {
    // 选课系统中学院名称的*前两个字*，具体可参考下面的DeptIdMap
    '马克': [
      // 一个课程一个花括号
      {
        'name': '新时代中国特色社会主义理论与实践研究',
        'wishes': [ // 可以为空列表
          // 每个班用一个花括号，notes里可以随意填写，给自己看的。
          {
            'courseid': '030500MGB001H-10',
            'notes': '2-10周 周四(9-12)'
          },
          {
            'courseid': '030500MGB001H-34',
            'notes': '11-18周 周四(9-12)'
          }
        ]
      },
      {
        'name': '自然辩证法概论',
        'wishes': [
          {
            'courseid': '010108MGB001H-16',
            'notes': '周三(9-12)'
          },
          {
            'courseid': '010108MGB001H-30',
            'notes': '周六(9-12)'
          },
          {
            'courseid': '010108MGB001H-31',
            'notes': '周六(9-12)'
          }
        ]
      },
    ],
  },
};


const DeptIdMap = {
  '数学': "id_910", '物理': "id_911", '天文': "id_957", '化学': "id_912", '材料': "id_928",
  '生命': "id_913", '地球': "id_914", '资环': "id_921", '计算': "id_951", '电子': "id_952",
  '工程': "id_958", '经管': "id_917", '公管': "id_945", '人文': "id_927", '马克': "id_964",
  '外语': "id_915", '中丹': "id_954", '国际': "id_955", '存济': "id_959", '体育': "id_946",
  '微电': "id_961", '未来': "id_962", '网络': "id_963", '心理': "id_968", '人工': "id_969",
  '纳米': "id_970", '艺术': "id_971", '光电': "id_972", '创新': "id_967", '核学': "id_973",
  '现代': "id_974", '化学': "id_975", '海洋': "id_976", '航空': "id_977", '杭州': "id_979",
  '南京': "id_985", '应急': "id_987",
};

// 设置样式
const mycss = `
  .transp{
    background:transparent;
    border-width:0;
    outline:none;
  }
  .notes{
  }
  .nowrap{
    white-space: nowrap;
  }
  .bgabtn.jump{
    background:transparent;
    border-width:0;
    outline:none;
    padding: 0;
    margin: 0;
  }
  .bgabtn.dept{
    border-width: 1px;
    padding: 2px;
    margin: 0;
    margin-left: 1px;
  }
  .bgabtn.dept.checked{
    background-color: darkgray;
  }
  .bgabtn.course{
    max-width: 150px;
    border-width: 1px;
    padding: 1px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .bgabtn.courseid{
    border-width: 1px;
    padding: 2px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .bgabtn.highlight{
    background-color: yellow;
  }
  .bgabtn:active{
    background-color: gray;
  }
  .bgabtn.selected{
    color: greenyellow !important;
    background-color: darkgray;
  }
  .bgabtn.full{
    color: red;
  }
  #divHeader{
    cursor:move;
  }
`
var sty = document.createElement("style");
sty.type = "text/css";
sty.appendChild(document.createTextNode(mycss));
document.body.appendChild(sty);

var divCourseWish; // ui界面按钮部分
var alreadyHighlighted;
function prefix (...data) {
  return ['[抢课辅助]', ...data];
}

function createElement(element, attribute, inner) {
  if (typeof(element) === "undefined") {
	return false;
  }
  if (typeof(inner) === "undefined") {
	inner = "";
  }
  var el = document.createElement(element);
  if (typeof(attribute) === 'object') {
	for (var key in attribute) {
	  el.setAttribute(key, attribute[key]);
	}
  }
  if (!Array.isArray(inner)) {
	inner = [inner];
  }
  for (var k = 0; k < inner.length; k++) {
	if (inner[k].tagName) {
	  el.appendChild(inner[k]);
	} else {
	  el.appendChild(document.createTextNode(inner[k]));
	}
  }
  return el;
}


function drawPanel (page) {
  let divHeader = createElement(
    'div',
    { id: "divHeader", style: "min-width: 150px; font-size:20px;font-weight: bold;text-align: center;position: fixed;width: 100%;height: 25px;border-bottom: 1px solid;" },
    '待选课程'
  );

  divCourseWish = createElement(
    'div',
    { id: "divCourseWish", style: "margin-top: 25px; max-height: 300px; overflow-y: auto;" }
  );
  let table = createElement('table', { id: "courseWish", border: "1", style: "font-size: 14px;" });
  let tbody = createElement('tbody');
  divCourseWish.append(table);
  table.appendChild(tbody);

  let divAppendix = createElement('div', { id: "divAppendix", style: "margin: 5px; max-height: 300px; overflow-y: auto;" });

  let divDrag = createElement('div', { draggable:"true", id:"divDrag", style:"bottom: 0; width:100%; height:5px; background-color:#999; cursor:n-resize;" });

  let panel = createElement(
    'div',
    { id: 'bgapanel', style: "border: 1px solid; width: fit-content; position: fixed; top: 65px; right: 0; z-index: 99999; background-color: rgba(220,221,192,0.8); overflow-x: auto;" },
    [divHeader, divCourseWish, divAppendix, divDrag]
  );
  document.body.appendChild(panel);

  let isCourseSelection = page == 'selectCourse' || page == 'debug';  // 进入选课页面
  let isMain = page == 'main';  // 进入筛选学院页面
  let wishList = config.wishList;  // 待选课程数据
  let bgaBtnId = 1;  // 设置bgaBtn 的id编号，每次加1
  let chks_course=[];  // 选课复选框保存，用于统一设置事件监听器
  let chks_deg = [];  // 学位课复选框保存，用于统一设置事件监听器

  let fullIds = new Set(GM_getValue('fullIds', []));  // 已选满的课程ID

  // ===== 绘制ui面板中的课程部分 ===================================================================
  for (const dept in wishList) {
    let courses = wishList[dept];
    let deptid = DeptIdMap[dept];
    let firstdept = true;
    for (const course of courses) {
      // 一门课
      let name = course.name;
      let wishes = course.wishes;
      let firstrow = true;
      if (wishes.length > 0) {
        // wishes里配置了具体的内容
        for (let wish of wishes) {
          let tr = createElement('tr');
          // tab += '<tr>';
          if (firstrow) {
            if (firstdept) {
              let td = createElement('td', { rowspan: wishes.length });
              let btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn dept jumpdept nowrap", deptid: deptid }, `${dept}🚀`);
              td.appendChild(btn);

              tr.appendChild(td);
              firstdept = false;
            } else {
              let td = createElement('td', { rowspan: wishes.length });
              tr.appendChild(td);
            }
            let btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn course copyable jumpcourse", deptid: deptid, name: name }, `${name}🚀`);
            let td = createElement('td', { rowspan: wishes.length });
            td.appendChild(btn);
            
            tr.appendChild(td);
            firstrow = false;
          }
          // 在ui的每一门课旁边添加选课/学位复选框(如果搜索到的话) =====================================
          let courseidspan = getElementsByText($("#regfrm span"), wish.courseid);
          if (isCourseSelection && courseidspan.length) {
            let row = courseidspan.closest('tr');

            // 选课
            let chk_course_old = row.find('td:first-child input').get(0);
            let chk_course = createElement('input', { type: 'checkbox', 'title': '选课', 'style': 'margin-left:2px; margin-right: 2px;' });
            chk_course.disabled = chk_course_old.disabled;
            
            // 学位
            let chk_deg_old = row.find('td:nth-child(2) input').get(0);
            let chk_deg = createElement('input', { type: 'checkbox', 'title': '设为学位课' });
            chk_deg.disabled = chk_deg_old.disabled;

            let td = createElement('td');
            let btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn courseid copyable nowrap jumpcourseid", deptid: deptid, courseid: wish.courseid }, `${wish.courseid}🚀`);
            td.appendChild(chk_course);
            td.appendChild(chk_deg);
            td.appendChild(btn);

            tr.appendChild(td);

            // 记录
            chks_course.push({ old: chk_course_old, new: chk_course });
            chks_deg.push({ old: chk_deg_old, new: chk_deg });
            if (chk_course.disabled) {
              fullIds.add(wish.courseid);
            }
          // =end= 在ui的每一门课旁边添加选课/学位复选框(如果搜索到的话) =============================
          } else {
            let td = createElement('td');
            let btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn courseid copyable nowrap jumpcourseid", deptid: deptid, courseid: wish.courseid }, `${wish.courseid}🚀`);
            td.appendChild(btn);

            tr.appendChild(td);
          }
          let td = createElement('td', { class: 'notes' }, wish.notes);
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      } else {
        // wishes为空列表
        let tr = createElement('tr');
        
        let td = createElement('td');
        let btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn dept jumpdept", deptid: deptid }, `${dept}🚀`);
        td.appendChild(btn);
        tr.appendChild(td);
        
        td = createElement('td');
        btn = createElement('button', { id: `bgabtn${bgaBtnId++}`, class: "bgabtn course copyable jumpcourse", deptid: deptid, name: name }, `${name}🚀`);
        td.appendChild(btn);
        tr.appendChild(td);
        
        tr.appendChild(createElement('td'));
        tr.appendChild(createElement('td'));

        tbody.appendChild(tr)
      }
    }
  }
  // =end= 绘制ui面板 ===================================================================

  // divAppendix 附录栏
  // ===== 筛选页面添加按钮 =======================================================
  if (isMain) {
    // 添加"重置按钮样式"按钮 (暂时没有使用该按钮的需求)
    // let bgaResetBtnStyle = createElement(
    //   'button',
    //   { id: 'bgaresetbtnstyle', type: 'submit', class: 'btn btn-primary', title: '重置所有课程编码按钮的样式' },
    //   '重置按钮样式'
    // );
    // bgaResetBtnStyle.style.marginLeft = '5px';
    // bgaResetBtnStyle.style.marginRight = '5px';
    // divAppendix.appendChild(bgaResetBtnStyle);

  }
  // =end= 筛选页面添加按钮 =======================================================


  // ===== 选课页面添加验证码和提交按钮 ===========================================================
  else if (isCourseSelection) {

    // 插入验证码 加在onload事件里保证验证码加载出来
    let bgaValiImg = createElement(
      'img',
      { id: 'bgaValiImg', title: '点击更换验证码(已修复)', align: 'bottom' } 
    )
    bgaValiImg.style.cursor = 'pointer';
    divAppendix.appendChild(bgaValiImg);
    // img.width = ValidateImg.width;
    // img.height = ValidateImg.height;

    // 插入验证码输入框
    let bgaValiInput = createElement(
      'input',
      { id: 'bgavcode', type: 'text' }
    );
    bgaValiInput.style.width = '50px';
    bgaValiInput.style.marginLeft = '5px';
    bgaValiInput.style.marginRight = '5px';
    divAppendix.appendChild(bgaValiInput);
    
    // 添加"确定提交选课"按钮
    let bgaSubmit = createElement(
      'button',
      { id: 'bgasubmit', type: 'submit', class: 'btn btn-primary' },
      '确定提交选课'
    );
    divAppendix.appendChild(bgaSubmit);

  }
  // =end= 选课页面添加验证码和提交按钮 ===========================================================


  // ===== 配置各种listener(必须要panel添加到body之后才能设置，在这之前设置的都无效，并且需要重新搜索元素)==========================
  if (isMain) {
    // 进入筛选学院页面

    // 一键筛选学院
    $(".bgabtn.dept").click(function () {
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      sumbitFilterDept(deptid);
    });

    // 复制课程代码和课程名称
    // $(".copyable").click(function () {
    //   $(".copyable").removeClass("copied");
    //   GM_setClipboard($(this).text().replace('🚀', ''));
    //   $(this).addClass("copied");
    // });
    
    // 一键跳转到课程：
    // 单击课程名，自动筛选学院后，自动定位到匹配到的第一行，并且匹配项高亮
    $('.jumpcourse').click(function () {
      $('.jumpcourse').removeClass('highlight');
      $('.jumpcourseid').removeClass('highlight');
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      let coursename = $(this).attr('name');
      let btnId = $(this).attr('id');  // 方便跳转后高亮
      let behavior = setBehavior('coursename', coursename, null, btnId);
      sumbitFilterDept(deptid, behavior);
    });

    // 一键跳转到课程id：
    // 单击课程id，自动筛选学院后，自动定位到匹配行，并且匹配项高亮
    $('.jumpcourseid').click(function () {
      $('.jumpcourse').removeClass('highlight');
      $('.jumpcourseid').removeClass('highlight');
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      let courseid = $(this).attr('courseid');
      let btnId = $(this).attr('id');  // 方便跳转后高亮
      let behavior = setBehavior('courseid', courseid, null, btnId);
      sumbitFilterDept(deptid, behavior);
    });

    // 重置课程编码按钮样式
    $('#bgaresetbtnstyle').click(() => {
      // remove 'selected' and 'full' for courseid btns
      $('.bgabtn.courseid').each((ind, ele) => { 
        $(ele).prop('disabled', false);
        $(ele).removeClass('selected');
        $(ele).removeClass('full');
      });
      // clear storage
      GM_setValue('selectedIds', []);
      GM_setValue('fullIds', []);
    });


  }else if (isCourseSelection) {
    // 进入选课页面

    // 单击课程名，自动定位到匹配到的第一行，并且匹配项高亮
    $('.jumpcourse').click(function () {
      let coursename = $(this).attr('name');
      let btnid = $(this).attr('id');
      let behavior = setBehavior('coursename', coursename, null, btnid);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    });

    // 单击课程id，自动定位到所在行，并且匹配项高亮
    $('.jumpcourseid').click(function () {
      let courseid = $(this).attr('courseid');
      let btnid = $(this).attr('id');
      let behavior = setBehavior('courseid', courseid, null, btnid);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    });

    // 同步复选框勾选情况
    for (const tup of chks_course) {
      $(tup.old).change(function() {
        $(tup.new).prop("checked", this.checked);
      });
      $(tup.new).change(function() {
        $(tup.old).prop("checked", this.checked);
      });
    }
    for (const tup of chks_deg) {
      $(tup.old).change(function() {
        $(tup.new).prop("checked", this.checked);
      });
      $(tup.new).change(function() {
        $(tup.old).prop("checked", this.checked);
      });
    }

    // 修复原网站中"点击切换验证码"没反应的bug
    let valiImg = document.getElementById('adminValidateImg');
    valiImg.title = bgaValiImg.title;
    valiImg.onclick = function(){
      document.getElementById("adminValidateImg").src = '/captchaImage' + "?" + Math.random();
    };
    // 验证码显示及点击刷新时同步
    document.getElementById('bgaValiImg').onclick = function () {
      valiImg.onclick();
    }
    valiImg.addEventListener('load', () => {
      document.getElementById('bgaValiImg').src = getBase64Image(valiImg);
    });
    // 有时刚进去图片就加载了，不会触发onload，需要手动设置src
    let dataurl = getBase64Image(valiImg);
    if (dataurl != 'data:,') {
      document.getElementById('bgaValiImg').src = dataurl;
    }
  
    // 同步两个验证码框的输入
    $("#bgavcode").on('input', function(){
      $("#vcode").val($("#bgavcode").val());
    });
  
    $("#vcode").on('input', function(){
      $("#bgavcode").val($("#vcode").val());
    });
    
    // 提交选课时自动跳过"确认提交吗"对话框
    // note: 搜索$("#regfrm").validate，用到了jquery.validate
    let validator = $("#regfrm").validate();
    // 推测validate包装了form的submit函数，因此去掉这一层包装
    $('#regfrm').off("submit");
    
    // 在保留validator的情况下，绕过原本的submit
    let subbtn = $('#regfrm button[type="submit"]');
    subbtn.prop('id', 'oldsubmit');
    subbtn.prop('type', 'button');  // 原submit如果不改的话，点击会触发form的默认submit，就不进行其他验证直接提交了
    subbtn.click(function () {
      if (validator.form()) {
        // 通过验证（勾选选课框+输入验证码）后，触发form原本的submit请求
        loading('正在提交，请稍等...');
        validator.currentForm.submit()
      }
      // 否则会直接触发报错提示
    });
    
    // ui面板里的提交按钮与原来的按钮同步
    $("#bgapanel button[type='submit']").click(function () {
      $('#oldsubmit').click();
      // $('#regfrm button[type="submit"]').click();
    });
  }
  // =end= 配置各种listener(必须要panel添加到body之后才能设置，在这之前设置的都无效，并且需要重新搜索元素)==========================


  // ===== 在ui中标注已经抢到的课：文字变绿，按钮不可点击 ======================================
  // 读取已选择课程列表
  let selectedIds = getSelectedIds(isMain);
  // 更新已选课程的按钮样式
  // selectedIds: Set
  // 不论哪个页面都修改ui的状态
  for (const selectedId of selectedIds.values()) {
    let uiBtn = $(`.bgabtn.courseid[courseid=${selectedId}]`);
    if (uiBtn) {
      uiBtn.prop('disabled', true);
      uiBtn.addClass('selected');
    }
  }
  // =end= 在ui中标注已经抢到的课：文字变绿，按钮不可点击 =================================

  // ===== 在ui中标注已满的课：文字变红 ======================================
  if (isCourseSelection) {
    // fullIds数组已在前面添加复选框时更新
    // 存到storage里，方便进入学院筛选页面后也可以保持状态
    GM_setValue('fullIds', [...fullIds]);
  }
  // 不论哪个页面都修改ui的状态
  for (const fullId of fullIds.values()) {
    let uiBtn = $(`.bgabtn.courseid[courseid=${fullId}]`);
    if (uiBtn) {
      uiBtn.addClass('full');
    }
  }
  // =end= 在ui中标注已满的课：文字变红 ===============================

  // ===== 可拖动 ===============================
  let dragopts = {
    setCursor: false,
    setPosition: false,
    handle: document.getElementById("divHeader"),
    onDragEnd: function () {
      // 避免出界，设置最大最小值
      let frmleft = panel.offsetLeft;
      let frmtop = panel.offsetTop;
      frmleft = Math.max(0, Math.min(frmleft, innerWidth - 200));  // 0 < frmleft < innerWidth - 100
      frmtop = Math.max(0, Math.min(frmtop, innerHeight - 50));

      panel.style.left = frmleft + "px";
      panel.style.top = frmtop + "px";
      // 记录left、top
      GM_setValue('frmleft', panel.offsetLeft);
      GM_setValue('frmtop', panel.offsetTop);
    }
  };
  new Draggable(panel, dragopts);
  // =end= 可拖动 ===============================

  // 一键跳转功能跳转后，插件页面保持之前滚动条的位置
  divCourseWish.scrollTop = GM_getValue('scrollTop', 0);
  divCourseWish.onscroll = function () {
    GM_setValue('scrollTop', divCourseWish.scrollTop);
  };

  // 允许手动调整panel长度，并记录在storage
  // 加载panel高度
  let frmheight = GM_getValue('frmheight');  // default: undefined
  if (frmheight) {
    divCourseWish.style.maxHeight = frmheight;
  }
  // 加载paneltop、left
  let frmleft = GM_getValue('frmleft');
  if (frmleft) {
    panel.style.left = frmleft + 'px';
  }
  let frmtop = GM_getValue('frmtop');
  if (frmtop) {
    panel.style.top = frmtop + 'px';
  }
  addEventListener('resize', Cowboy.debounce(250, function () {
    // 调整浏览器大小时，避免ui面板出界，设置最大最小值
    let frmleft = panel.offsetLeft;
    let frmtop = panel.offsetTop;
    frmleft = Math.max(0, Math.min(frmleft, innerWidth - 200));  // 0 < frmleft < innerWidth - 100
    frmtop = Math.max(0, Math.min(frmtop, innerHeight - 50));

    panel.style.left = frmleft + "px";
    panel.style.top = frmtop + "px";
    // 记录left、top
    GM_setValue('frmleft', panel.offsetLeft);
    GM_setValue('frmtop', panel.offsetTop);
    // TODO 改为面板跟着移动
    
  }));
  // 绑定需要拖拽改变大小的元素对象
  bindResize(divCourseWish);
  function bindResize(el) {
    //初始化参数
    var els = el.style;
    //鼠标的 X 和 Y 轴坐标
    var y = 0;
    //邪恶的食指
    $("#divDrag").mousedown(function (e) {
      //按下元素后，计算当前鼠标与对象计算后的坐标
      (y = e.clientY - el.offsetHeight);
      //在支持 setCapture 做些东东
      //绑定事件
      $(el).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
      $(document.body).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
      //防止默认事件发生
      e.preventDefault();
    });
    //移动事件
    function mouseMove(e) {
      //宇宙超级无敌运算中...
      els.maxHeight = e.clientY - y + "px";
    }
    //停止事件
    function mouseUp() {
      // 存储高度
      GM_setValue('frmheight', divCourseWish.style.maxHeight); // 包含"px"
      //卸载事件
      $(el)
        .unbind("mousemove", mouseMove)
        .unbind("mouseup", mouseUp);
      $(document.body)
        .unbind("mousemove", mouseMove)
        .unbind("mouseup", mouseUp);
    }
  }

  return panel;
}

function getSelectedIds (isMain) {
  if (isMain) {
    // 在筛选学院页面的话，读取当前已选择课程列表
    let selectedIds = new Set();  // 外层已定义
    $('table.table tbody tr a[href*=plan]').each((ind, ele) => {
      let courseId = ele.text;
      selectedIds.add(courseId);
    });
    // 存到storage里，方便进入选课页面后也可以保持状态
    GM_setValue('selectedIds', [...selectedIds]);
    return selectedIds;
  }
  // 否则直接返回记录
  return GM_getValue('selectedIds', []);
}

function setBehavior(type, data, scrollTop, btnId) {
  // 设置跨网页json数据
  let behavior = {
    'type': type,  // 'courseid' or 'coursename'
    'data': data,
    // 'scrollTop': scrollTop,  // ui界面滚动条位置。改用storage传输不通过behavior传/
    'btnId': btnId,
  }
  return behavior;
}

function resolveBehavior (behavior, alreadyHighlighted=null) {
  // 解析json数据
  if (behavior.btnId) {
    // 清空其他按钮高亮
    $('.jumpcourse').removeClass('highlight');
    $('.jumpcourseid').removeClass('highlight');
    // 高亮按钮
    $(`#${behavior.btnId}`).addClass('highlight');
  }
  if (behavior.scrollTop) {
    // 插件面板滚动条恢复到之前位置
    divCourseWish.scrollTop = behavior.scrollTop;
  }
  let highlighted;  // 待高亮DOM
  if (behavior.type) {
    // 自动滚动定位+高亮课程/课程号
    if (behavior.type == 'courseid') {
      let courseid = behavior.data;
      let courseidspan = getElementsByText($("#regfrm span"), courseid);
      // 如果找到
      if (courseidspan.length) {
        // 跳转到指定位置，并高亮对应行
        highlighted = courseidspan;
      }
    } else if (behavior.type == 'coursename') {
      let coursename = behavior.data;
      let coursenametag = getElementsByText($("#regfrm a"), coursename, true);
      // 如果找到
      if (coursenametag.length) {
        // 跳转到指定位置，并高亮对应行
        highlighted = coursenametag.first();  // 可能有多个匹配，只取第一个
      }
    }
    if (highlighted) {
      // 清空其他高亮
      if (alreadyHighlighted) {
        alreadyHighlighted.css('background-color', '');
      } else {
        $('#regfrm span[style*=yellow]').css('background-color', '');
        $('#regfrm a[style*=yellow]').css('background-color', '');
      }
      // 高亮匹配项
      highlighted.css('background-color', 'yellow');
      scrollto(highlighted);
    } else {
      error('未搜索到课程 ' + behavior.data);
    }
  }
  return highlighted;
}

function injectJsonToAction (selector, json) {
  let action = $(selector).prop("action");
  let jsonstr = JSON.stringify(json);
  action = action.replace(/#.+/, '');
  action += "#bgabehavior" + jsonstr;
  $(selector).prop("action", action);
}

function sumbitFilterDept (deptid, behavior) {
  // 清空所有勾选情况
  $("#regfrm2 input[type='checkbox']").prop('checked', false);
  // 勾选当前学院
  $(`#${deptid}`).prop("checked", true);
  if (behavior) {
    injectJsonToAction('#regfrm2', behavior)
  }
  // 提交
  $("#regfrm2 button[type='submit']").submit();
}

function getElementsByText(elems, value, isFuzzy=false){
  return elems.filter(function (index) {
    if (isFuzzy) {
      return $(this).text().includes(value);
    } else {
      return $(this).text() == value;
    }
  });
}
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
function scrollto(jqele) {
  // offset header which is 60px in height
  let buffer = document.createElement('div');
  buffer.id = randomString(5);
  buffer.style.display = 'block';
  buffer.style.height = '65px';
  buffer.style.marginTop = '-65px';
  buffer.style.visibility = 'hidden';
  $(buffer).insertBefore(jqele);

  let a = document.createElement('a');
  a.href = "#" + buffer.id;
  a.click();
}

function getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");
	return dataURL;
}

function error (msg) {
  // 解析时错误处理，错误提示使用选课系统自带的方法
  $.jBox.tip(msg);
}


(function () {
  'use strict';

  // 登录jwxk.ucas.ac.cn后，自动跳转到选课页面
  if (window.location.pathname == '/notice/view/1') {
    window.location.pathname = '/courseManage/main';
    console.log(...prefix('跳转到选课页面'));
  }

  
  if (window.location.pathname.startsWith('/courseManage/main')) {
    // 进入筛选学院页面
    let panel = drawPanel('main');

  }

  if (window.location.pathname.startsWith('/courseManage/selectCourse')) {
    // 进入选课页面
    let panel = drawPanel('selectCourse');

    // 解析跨页json参数(如果有)
    let url = window.location.href;
    let ind = url.indexOf('#bgabehavior');
    if (ind != -1) {
      let data = url.substring(ind + '#bgabehavior'.length);
      data = decodeURI(data);
      let behavior = JSON.parse(data);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    }
  }
})();