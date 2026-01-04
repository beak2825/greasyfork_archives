// ==UserScript==
// @name         ds-mock
// @namespace    http://ds.net/
// @version      0.6
// @description  mock
// @author       You
// @match        *://192.168.3.108/*
// @match        *://192.168.4.69/*
// @icon         http://192.168.3.108/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479340/ds-mock.user.js
// @updateURL https://update.greasyfork.org/scripts/479340/ds-mock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const toast = function(text, time) {
        let toast = document.getElementById('toast');
        let toast_box = document.getElementsByClassName('toast_box')[0];
        toast.innerHTML = text;
        toast_box.style.animation = 'show 1.5s'
        toast_box.style.display = 'inline-block';
        setTimeout(function(){
            toast_box.style.animation = 'hide 1.5s'
            setTimeout(function(){
                toast_box.style.display = 'none';
            }, 1400)
        }, time)
    }
    const createElementToast = function(){
        let css = `
    @keyframes show {
          0% {
              opacity: 0;
          }
          100% {
              opacity: 1;
          }
      }
      @keyframes hide {
          0% {
              opacity: 1;
          }
          100% {
              opacity: 0;
          }
      }
      .toast_box {
          position: absolute;
          bottom: 50%;
          left: 50%;
          z-index: 9999999999;
          transform: translate(-50%, -50%);
          display: none;
      }
      .toast_box p {
          box-sizing: border-box;
          padding: 10px 20px;
          width: max-content;
        /* 提示框的背景色 */
          background: #707070;
          color: #fff;
          font-size: 16px;
          text-align: center;
          border-radius: 6px;
          opacity: 0.8;
      }
      .toliet{
        margin: 0 auto;
      }
    `;
        GM_addStyle(css);
        let toastElement = document.createElement('div');
        toastElement.className = 'toast_box';
        toastElement.innerHTML = `<p id="toast"></p>`;
        document.body.appendChild(toastElement);

    }
    createElementToast();
    const mappingName = {
        'surgery': '手术',
        'blood': '老血制品',
        'specimen': '标本',
        'inspect': '检查',
        'drugsBag': '药品',
        'xieheblood': '新血制品',
        'jpBag': '静配',
    };
    const mappingIndex = {
        'surgery':0,
        'blood': 1,
        'specimen': 2,
        'inspect': 3,
        'drugsBag': 4,
        'xieheblood': 5,
        'jpBag': 6,
    };
    const createElementWrap = function(){
        let wrapElement = document.createElement("div");
        wrapElement.id = "seiminMock";
        let mock_css = `
        #seiminMock{
          width:300px;
          position: fixed;
          top: 0;
          left: 0;
          background-color: rgba(0,0,0,0.2);
          z-index: 999999;
          padding-bottom: 30px;
          cursor: move;
        }
        #seiminMock input{
          width:100px;
        }
      `;
        GM_addStyle(mock_css);
        wrapElement.onmousedown = function (ev) {
            let oevent = ev || event;
            let distanceX = oevent.clientX - wrapElement.offsetLeft;
            let distanceY = oevent.clientY - wrapElement.offsetTop;

            document.onmousemove = function (ev) {
                let oevent = ev || event;
                wrapElement.style.left = oevent.clientX - distanceX + 'px';
                wrapElement.style.top = oevent.clientY - distanceY + 'px';
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
        document.body.appendChild(wrapElement);
        return wrapElement;
    }
    // 生成数据方法
    const makeData = function(type, queryParamsObj = {}, num=1){
        let queryParams = new URLSearchParams(queryParamsObj).toString();
        fetch(`${location.origin}/service/testData/make/${type}/${num}${queryParams ? '?' + queryParams : ''}`,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            if(res.status == 200){
                toast('操作成功', 3000);
            }else{
                toast('操作失败', 3000);
            }
        })
    }

    // 生成下拉框
    const createDropdown = (id, options) => {
        const select = document.createElement('select');
        select.id = id;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
        return select;
    };
    // 渲染下拉列表
    const renderList = function(type, list=[]){
        let select = document.getElementById(type);
        select.innerHTML = '';
        list.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
    }
    // 下拉框配置
    const dropdownsConfig = [
        { id: 'dropdown1', options: [{ value: '', label:'请选择院区' }]},
        { id: 'dropdown2', options: [{ value: '', label:'请选择科室' }]},
        { id: 'dropdown3', options: [{ value: '', label:'请选择患者' }]}
    ];
    // 获取院区列表
    const getHospitalList = function(){
        fetch(`${location.origin}/service/data/fetchDataList/hospital`,{
            method: 'post',
            body: JSON.stringify({ idx: 0, sum: 99999 }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            if(res.status == 200){
                dropdownsConfig[0].options = [{ value: '', label:'请选择院区' }].concat(res.list.map(v => ({ value: v.id, label: v.hosName })))
            }else{
                dropdownsConfig[0].options = [{ value: '', label:'请选择院区' }]
            }
            renderList('dropdown1', dropdownsConfig[0].options)
        })
    }

    // 获取科室列表
    const getDeptList = function(){
        let hosId = document.getElementById('dropdown1').value ? +document.getElementById('dropdown1').value : undefined;
        if(!hosId){
            dropdownsConfig[1].options = [{ value: '', label:'请选择科室' }]
            renderList('dropdown2', dropdownsConfig[1].options)
            return;
        }
        fetch(`${location.origin}/service/data/fetchDataList/department`,{
            method: 'post',
            body: JSON.stringify({ idx: 0, sum: 99999, department: { hospital: { id: hosId } } }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            if(res.status == 200){
                let deptList = res.list.map(v => ({ value: v.id, label: v.dept }));
                dropdownsConfig[1].options = [{ value: '', label:'请选择科室' }].concat(deptList);
            }else{
                dropdownsConfig[1].options = [{ value: '', label:'请选择科室' }]
            }
            renderList('dropdown2', dropdownsConfig[1].options)
        })
    }

    // 获取患者列表
    const getPatientList = function(){
        let deptId = document.getElementById('dropdown2').value ? +document.getElementById('dropdown2').value : undefined;
        console.log(deptId)
        if(!deptId){
            dropdownsConfig[2].options = [{ value: '', label:'请选择患者' }]
            renderList('dropdown3', dropdownsConfig[2].options)
            return;
        }
        fetch(`${location.origin}/service/data/fetchDataList/patient`,{
            method: 'post',
            body: JSON.stringify({ idx: 0, sum: 99999, patient: { department: { id: deptId } } }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            if(res.status == 200){
                let patientList = res.list.map(v => ({ value: v.id, label: v.patientName }));
                dropdownsConfig[2].options = [{ value: '', label:'请选择患者' }].concat(patientList);
            }else{
                dropdownsConfig[2].options = [{ value: '', label:'请选择患者' }]
            }
            renderList('dropdown3', dropdownsConfig[2].options)
        })
    }

    const specimenFun = function(type){
        // 创建弹窗容器
        const popup = document.createElement('div');
        popup.id = 'popup-content-mask';
        popup.innerHTML = `
        <div class="custom-popup">
            <div class="popup-content">
                <h3 class="popup-title">请选择配置项<input type="number" value="1" id="num" min="1" step="1" oninput="this.value = Math.abs(Math.floor(this.value)) || 1"></h3>
                <div class="dropdown-container"></div>
                <div class="popupBtn">
                  <button id="confirm-btn">确认</button>
                  <button id="cancel-btn">取消</button>
                </div>
            </div>
        </div>
        <style>
            #num{
                width: 50px;
            }
            .popup-title{
                display: flex;
                justify-content: space-between;
            }
            #popup-content-mask {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,.4);
                z-index: 99999999;
            }
            .custom-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0,0,0,0.2);
                z-index: 99999999;
            }
            .dropdown-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 20px 0;
            }
            select {
                width: 200px;
                padding: 8px;
                border: 1px solid #0073ea;
                border-radius: 4px;
            }
            #confirm-btn {
                flex: 1;
                padding: 10px;
                background: #0073ea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            #cancel-btn {
                flex: 1;
                padding: 10px;
                background: gray;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .popupBtn{
              display:flex;
              align-items:center;
              jusify-content:space-bwtewwn;
              gap: 16px;
            }
        </style>
       `;

        // 注入元素
        document.body.appendChild(popup);

        getHospitalList();

        const container = popup.querySelector('.dropdown-container');
        dropdownsConfig.forEach(config => {
            container.appendChild(createDropdown(config.id, config.options));
        });

        // 选择院区
        document.getElementById('dropdown1').addEventListener('change', () => {
            document.getElementById("dropdown2").value = "";
            document.getElementById("dropdown3").value = "";

            getDeptList();
            getPatientList();
        });
        // 选择科室
        document.getElementById('dropdown2').addEventListener('change', () => {
            document.getElementById("dropdown3").value = "";

            getPatientList();
        });

        // 确认按钮事件
        document.getElementById('confirm-btn').addEventListener('click', () => {
            const selectedValues = dropdownsConfig.map(config =>
              document.getElementById(config.id).value
            );
            console.log('当前选择：', selectedValues);
            if(!selectedValues[0]){
                toast('院区必填！', 3000);
                return;
            }
            if(!selectedValues[1]){
                toast('科室必填！', 3000);
                return;
            }
            if(!selectedValues[2]){
                toast('患者必填！', 3000);
                return;
            }

            makeData(type, { hosId: +selectedValues[0], applyDept: +selectedValues[1], patientId: +selectedValues[2] }, +document.getElementById('num').value);
        });
        // 取消按钮事件
        document.getElementById('cancel-btn').addEventListener('click', () => {
            popup.remove(); // 关闭弹窗
        });
    }

    const createElementButton = function(elementWrap, type){
        let addElement = document.createElement("input");
        addElement.type = "button";
        addElement.id = `add_${type}`;
        addElement.value = `生成${mappingName[type]}`;
        addElement.addEventListener('click', function(){
            switch(type){
                case 'specimen':
                    specimenFun(type);
                    break;
                default:
                    makeData(type);
            }
        }, false);
        elementWrap.appendChild(addElement);
    };
    let elementWrap = createElementWrap();
    createElementButton(elementWrap, 'surgery');
    createElementButton(elementWrap, 'blood');
    createElementButton(elementWrap, 'specimen');
    createElementButton(elementWrap, 'inspect');
    createElementButton(elementWrap, 'drugsBag');
    createElementButton(elementWrap, 'xieheblood');
    createElementButton(elementWrap, 'jpBag');

})();