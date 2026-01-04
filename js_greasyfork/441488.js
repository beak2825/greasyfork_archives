// ==UserScript==
// @name         页面生成身份证号小组件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  姓名、身份证号、手机号生成小组件
// @author       You
// @license      MIT
// @include      *://*
// @include      *://*.baidu.com/*
// @icon         https://bpic.51yuansu.com/pic2/cover/00/31/92/5810d33811f67_610.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441488/%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E5%B0%8F%E7%BB%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441488/%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E5%B0%8F%E7%BB%84%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let box = document.createElement('div')
    box.class = 'my_idcard_box'
    box.style.zIndex = 100000
    box.style.backgroundColor = '#48D1CC'
    // box.style.width = '220px'
    // box.style.height = '200px'
    box.style.position = 'fixed'
    box.style.top = '90px'
    box.style.right = '10px'
    box.style.padding = '5px'
    box.style.color = "#000"
    box.style.fontSize = "12px"
    box.style.textAlign = "left"

    let pOrder = document.createElement('p')
    pOrder.id = 'order'
    pOrder.innerHTML = '订单号：' + getNo('O')

    let pPolicy = document.createElement('p')
    pPolicy.id = 'policy'
    pPolicy.innerHTML = '保单号：' + getNo('P')

    let pName = document.createElement('p')
    pName.id = 'name'
    pName.innerHTML = '姓名：' + getName()

    let pIdNo = document.createElement('p')
    pIdNo.id = 'idno'
    pIdNo.innerHTML = '身份证号：' + getId_no()

    let pPhone = document.createElement('p')
    pPhone.id = 'phone'
    pPhone.innerHTML = '手机号：' + getMoble()

    let hideBtn = document.createElement('button')
    hideBtn.textContent = "关闭"
    hideBtn.onclick = function () {
        box.style.display = "none"
    }

    let refreshBtn = document.createElement('button')
    refreshBtn.textContent = "刷新"
    refreshBtn.style = 'margin-left: 10px'
    refreshBtn.onclick = function () {
        // document.getElementById('order').innerHTML = '订单号：' + getNo('O')
        // document.getElementById('policy').innerHTML = '保单号：' + getNo('P')
        document.getElementById('name').innerHTML = '姓名：' + getName()
        document.getElementById('idno').innerHTML = '身份证号：' + getId_no()
        document.getElementById('phone').innerHTML = '手机号：' + getMoble()
    }

    // box.appendChild(pOrder)
    // box.appendChild(pPolicy)
    box.appendChild(pName)
    box.appendChild(pIdNo)
    box.appendChild(pPhone)

    box.appendChild(hideBtn)
    box.appendChild(refreshBtn)

    document.body.appendChild(box)

    function getNo(prefix) {
        let myDate = new Date()
        let year = myDate.getFullYear() //获取当前年
        let mon = myDate.getMonth() + 1 //获取当前月
        let date = myDate.getDate() //获取当前日
        let h = myDate.getHours() //获取当前小时数(0-23)
        let m = myDate.getMinutes() //获取当前分钟数(0-59)
        let s = myDate.getSeconds() //获取当前秒
        let tranNo = '' + year + mon + date + h + m + s
        return prefix + tranNo
    }
    // 生成随机姓名
    function getName() {
        let familyNames = new Array(
            '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹'
        );
        let givenNames = new Array(
            '子璇', '淼', '国栋', '夫子', '瑞堂', '甜', '敏', '尚', '国贤', '贺祥', '晨涛', '昊轩', '易轩', '益辰', '益帆', '益冉', '瑾春', '瑾昆', '春齐', '杨', '文昊', '东东', '雄霖', '浩晨', '熙涵', '溶溶', '冰枫', '欣欣', '宜豪', '欣慧', '建政', '美欣', '淑慧', '文轩', '文杰', '欣源', '忠林', '榕润', '欣汝', '慧嘉', '新建', '建林', '亦菲', '林', '冰洁', '佳欣', '涵涵', '禹辰', '淳美', '泽惠', '伟洋', '涵越', '润丽', '翔', '淑华', '晶莹', '凌晶', '苒溪', '雨涵', '嘉怡', '佳毅', '子辰', '佳琪', '紫轩', '瑞辰', '昕蕊', '萌', '明远', '欣宜', '泽远', '欣怡', '佳怡', '佳惠', '晨茜', '晨璐', '运昊', '汝鑫', '淑君', '晶滢', '润莎', '榕汕', '佳钰', '佳玉', '晓庆', '一鸣', '语晨', '添池', '添昊', '雨泽', '雅晗', '雅涵', '清妍', '诗悦', '嘉乐', '晨涵', '天赫', '玥傲', '佳昊', '天昊', '萌萌', '若萌'
        );
        let m = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random())
        let familyName = familyNames[m]
        let j = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random())
        let givenName = givenNames[m]
        let name = familyName + givenName
        return name;
    }

    //生成随机手机号
    function getMoble() {
        let prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
        let m = parseInt(10 * Math.random());
        let prefix = prefixArray[m];
        for (let j = 0; j < 8; j++) {
            prefix = prefix + Math.floor(Math.random() * 10);
        }
        return prefix;
    }

    // 生成随机身份证号
    function getId_no() {
        let coefficientArray = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'] // 加权因子
        let lastNumberArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码
        let address = '420101' // 住址
        let birthday = '19810101' // 生日
        let s = Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString()
        let array = (address + birthday + s).split('')
        let total = 0
        for (let i in array) {
            total = total + parseInt(array[i]) * parseInt(coefficientArray[i])
        }
        let lastNumber = lastNumberArray[parseInt(total % 11)]
        let id_no_String = address + birthday + s + lastNumber
        return id_no_String;
    }
})();

