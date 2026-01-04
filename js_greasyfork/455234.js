// ==UserScript==
// @name         AkubelaWords
// @namespace    http://www.akuvox.com/
// @version      0.2
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.10.118/newWords*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/455234/AkubelaWords.user.js
// @updateURL https://update.greasyfork.org/scripts/455234/AkubelaWords.meta.js
// ==/UserScript==

function jenkins_notify_words(user, product, langs) {
  console.log('jenkins_notify_words')
  console.log(product)
  console.log(langs)
  let url = 'http://192.168.10.51:62180/jenkins_words?' + "product=" + product + "&langs=" + langs + "&user=" + user
  let xhr = new XMLHttpRequest()
  xhr.open('get', url, true, '', '')
  xhr.send()
}

function BtnClick_submit() {
  console.log('BtnClick_submit')
  var elUutton = document
        .getElementsByClassName('el-button--large')[0]
        .getElementsByTagName('span')
      var user = elUutton[0].innerHTML
      console.log('user:' + user)

  var obj = document.getElementById('sel_product')
  var product = obj.options[obj.selectedIndex].value
  var objOptions = document.getElementById('sel_language').options
  const selectedValueArr = []
  for (let i = 0; i < objOptions.length; i++) {
    // 如果该option被选中，则将它的value存入数组
    if (objOptions[i].selected) {
      selectedValueArr.push(objOptions[i].value)
    }
  }
  // 如果后端需要字符串形式，比如逗号分隔
  var langs = selectedValueArr.join(',')

  if(langs == "")
  {
      alert("请先选择语言(可多选)")
  }

  jenkins_notify_words(user,product, langs)
}

function addselect_products(obj_elect, label = '') {
  obj_elect.options.add(new Option(label, label))
}

function addselect_languages(obj_elect, label = '') {
  obj_elect.options.add(new Option(label, label))
}

function addBtn() {
  var obj_ul = document.getElementsByClassName('el-radio-group radio')[0]
  obj_ul.style.display = 'flex'
  var li = document.createElement('li')
  li.className = 'aui-buttons'

  var obj_elect = document.createElement('select')
  obj_elect.id = 'sel_product'
  obj_elect.className = 'aui-button aui-button-primary'
  obj_elect.style.cssText =
    'width:150px;height: 40px;margin: 10px 0;padding: 2px 0;text-align:center;font-size: 12px;'

  var obj_select2 = document.createElement('select')
  obj_select2.id = 'sel_language'
  obj_select2.className = 'aui-button aui-button-primary'
  obj_select2.multiple = 'multiple'
  obj_select2.style.cssText =
    'width:200px;height: 70px;margin: 10px 0;padding: 2px 0;text-align:center;font-size: 12px;'

  var button = document.createElement('button')
  button.style.cssText ='width:100px;height: 50px;margin: 10px 0;padding: 2px 0;text-align:center;font-size: 12px;'
  button.className = 'aui-button aui-button-primary'
  button.id = 'myfilter'
  button.onclick = function () {
    BtnClick_submit()
  }
  var text1 = document.createTextNode('提交')
  button.appendChild(text1)


  // 请求连接
  fetch('http://192.168.10.118/newWordServer/word/getNav')
    .then((response) => response.json())
    .then((res) => {
      const langeArr = res.data.language
      const productsArr = res.data.products
      //addselect_languages(obj_select2, 'All')
      //obj_ul.appendChild(obj_select2)
      productsArr.forEach((item) => {
        addselect_languages(obj_elect, item.name)
        obj_ul.appendChild(obj_elect)
      })
      langeArr.forEach((item) => {
        addselect_languages(obj_select2, item.name)
        obj_ul.appendChild(obj_select2)
        obj_ul.appendChild(button)
      })
    })


  console.log(obj_ul)
}

;(function () {
  //主函数开始
  //创建button

  console.log('AkubelaWords')
  console.log('window: %o', window)

 function myinit() {
    setTimeout(() => {
      addBtn()
//       var elUutton = document
//         .getElementsByClassName('el-button--large')[0]
//         .getElementsByTagName('span')
//       var user = elUutton[0].innerHTML
//       console.log('user:' + user)
    }, 1000)
  }

  if (navigator.userAgent.indexOf('Firefox') >= 0) {
    //firefox 不支持 window.onload 直接调用函数
    console.log('xx2')
    myinit()
  } else {
    console.log('xx3')
    window.onload = myinit()
  }
})()
