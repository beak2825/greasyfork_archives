// ==UserScript==
// @name        店小秘-预填助手
// @namespace   None
// @match       https://www.dianxiaomi.com/smtProduct/edit.htm
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @icon        https://www.dianxiaomi.com/favicon.ico
// @version     1.5
// @license     MIT
// @author      Yang.Mr
// @description 2023/5/11 14:07:22
// @downloadURL https://update.greasyfork.org/scripts/471546/%E5%BA%97%E5%B0%8F%E7%A7%98-%E9%A2%84%E5%A1%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471546/%E5%BA%97%E5%B0%8F%E7%A7%98-%E9%A2%84%E5%A1%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
function make_requests(method,url,data=undefined,Accept="*/*"){
  return new Promise((resolve, reject) => {
    if(data !== undefined){
      GM_xmlhttpRequest({
        method:method,
        url:url,
        headers: {
          'Accept': Accept,
          'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data:data,
        onload: response => resolve(response),
        onerror: error => reject(error),
      });
    }
    else{
      GM_xmlhttpRequest({
        method:method,
        url:url,
        headers: {
          'Accept': Accept,
          'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: response => resolve(response),
        onerror: error => reject(error),
      })
    }
  });
}
if (!localStorage.hasOwnProperty("ToolSetting")){
  var tmpSetting = {
    "basic_setting":{
      "isCover":false
    },
    "sku_setting":{
      "isDynamicallyAddSKU":true,
      "is16hexEncode":true
    },
    "sku_style":{
      "isSingle":true,
      "isPage":false,
      "isBatch":false,
    }
  }
  localStorage.ToolSetting = JSON.stringify(tmpSetting);
}//初始化工具的设置选项
if (document.querySelector("button[data-value='save-3']") != undefined){
  let skuStyle = JSON.parse(localStorage.ToolSetting)["sku_style"];
  for([k,v] of Object.entries(skuStyle)){
    if(v){
      skuStyle = k;
      break;
    }
  }
  let toolSetting = JSON.parse(localStorage.ToolSetting);
  var m_click = new MouseEvent('click');
  var m_input = new KeyboardEvent("keyup",{bubbles: true, cancelable: true, keyCode: 13});
  let _baseDiv = document.createElement("div");
  _baseDiv.style.display = "none";
  _baseDiv.style.background = "white";
  _baseDiv.style.color = "black";
  _baseDiv.style.border = "1px solid #cccccc";
  _baseDiv.style.borderRadius = "5px";
  _baseDiv.style.position = "absolute";
  _baseDiv.style.left = "30px";
  _baseDiv.style.top = "0px";
  _baseDiv.style.height = "auto";
  _baseDiv.style.overflow = "hidden";
  _baseDiv.style.width = "350px";
  window.addEventListener('click', function(e){
    if (!_baseDiv.contains(e.target)){
      _baseDiv.style.display="none";
    }
  });
  let base_content = document.createElement("div");
  base_content.style.height = "250px";
  base_content.style.width = "100%";
  base_content.id = "myTool_content";
  base_content.style.overflowY = "auto";
  let ul = document.createElement("ul");
  ul.style.position= "revert";
  ul.style.width = "100%";
  //标题
  let _li = document.createElement("div");
  _li.className = "bgColor5 p5 fColor2 p-left10 cur-default";
  _li.appendChild(document.createTextNode("预填助手"));
  _baseDiv.appendChild(_li);
  _baseDiv.appendChild(base_content);

  const _box = document.createElement("div");
  _box.style.minHeight = "50px";
  _box.style.border = "1px solid #cccccc";
  _box.style.borderRadius = "5px";
  _box.style.margin="5px";
  _box_label = document.createElement("div");
  _box_label.style.width = "100%";
  _box_label.style.borderRadius = "5px 5px 0px 0px";
  _box_label.style.padding="3px";
  _box_label.style.height = "25px";
  _box_label.style.background = "#a1a1a1";
  _box.appendChild(_box_label)
  _box_check = document.createElement("input");
  _box_check.style.margin = "2px";
  _box_check.setAttribute("type","checkbox");
  _box_check.id ="_box_c_id";
  _box_check.setAttribute("onchange","this.parentNode.style.background = this.checked ? \"#25a174\":\"#a1a1a1\";")
  _box_text = document.createElement("span");
  _box_text.innerText = "";
  _box_text.className = "_box_title";
  _box_text.style.marginLeft = "5px";
  _box_text.style.fontFamily="黑体";
  _box_text.style.userSelect="none";
  _box_label.setAttribute("onclick","this.children[0].click();");
  _box_text.style.color = "white";
  _box_content = document.createElement("div");
  _box_content.style.minHeight = "23px";
  _box_content.className = "_box_content"
  _box_content.style.width = "100%";
  _box_content.style.padding = "3px";
  _box.appendChild(_box_content);
  _box_label.appendChild(_box_check);
  _box_label.appendChild(_box_text);

  let mushSKU_length = 0;

  (async function (){
    var _mainbox = _box.cloneNode(true);
    _mainbox_content = _mainbox.querySelector("._box_content");
    const brandList = document.querySelectorAll("select[attrid='2'] option:not([data-cid='noValue'])");
    const spaceOption = document.querySelector("select[attrid='2'] option[data-cid='noValue']");
    _mainbox.querySelector("#_box_c_id").id = "brand_isEnabled";
    _mainbox.querySelector("#brand_isEnabled").addEventListener("change",function(){
      localStorage.brand_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对品牌选项进行填充";
    var select = document.createElement("select");
    select.style.userSelect = "none";
    select.style.border = "0px";
    select.style.width = "100%";
    select.style.outline = "none";
    select.style.pointerEvents= "unset";
    select.fontFamily = "黑体";
    select.id = "brandSelect";
    select.addEventListener("change",function(){
      this.setAttribute("value",this.children[this.selectedIndex].getAttribute("data-cid"));
      localStorage.brand_v = this.getAttribute("value");
      setBrand();
    });
    select.appendChild(spaceOption.cloneNode(true));
    for (brand of brandList){
      select.appendChild(brand.cloneNode(true));
    }
    _mainbox_content.appendChild(select);
    var _autoSelectBrand = document.createElement("div");
    var _autoSelectBrand_chk = document.createElement("input");
    _autoSelectBrand_chk.setAttribute("type","checkbox");
    _autoSelectBrand_chk.style.margin = "2px";
    _autoSelectBrand_chk.addEventListener("change",function(){
      $("#brandSelect")[0].disabled = this.checked;
      if(this.checked){
        $("#brandSelect")[0].style.pointerEvents = "none";
      }else{
        $("#brandSelect")[0].style.pointerEvents = "unset";
      }
      localStorage.autoSelectBrand = this.checked;
      setBrand();
    });
    _autoSelectBrand.appendChild(_autoSelectBrand_chk);
    var _autoSelectBrand_label = document.createElement("lable");
    _autoSelectBrand_label.innerText = "自动选择品牌";
    _autoSelectBrand_label.style.fontFamily = "黑体";
    _autoSelectBrand_label.style.fontSize = "12px";
    _autoSelectBrand_label.style.userSelect ="none";
    _autoSelectBrand_label.addEventListener("click",function(){
      this.parentNode.children[0].click();
    });
    _autoSelectBrand.appendChild(_autoSelectBrand_label)
    _mainbox_content.appendChild(_autoSelectBrand);
    base_content.appendChild(_mainbox);
    if (localStorage.hasOwnProperty("brand_isEnabled") && decodeBool(localStorage.brand_isEnabled)){
      _mainbox.querySelector("#brand_isEnabled").checked = true;
      _mainbox.querySelector("#brand_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("brand_v") && Boolean(localStorage.brand_v)){
      var trueOption = select.querySelector(`option[data-cid='${localStorage.brand_v}']`)
      if(trueOption != undefined){
        select.selectedIndex = trueOption.index;
        trueOption.selected = true;
      }
    }
    if (localStorage.hasOwnProperty("autoSelectBrand") && decodeBool(localStorage.autoSelectBrand)){
      _autoSelectBrand_chk.checked = true;
      select.disabled = true;
      select.style.pointerEvents = "none";
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "sku_isEnabled";
    _mainbox.querySelector("#sku_isEnabled").addEventListener("change",function(){
      localStorage.sku_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对【SKU、库存】进行填充";
    base_content.appendChild(_mainbox);
    var sku = document.createElement("div");
    sku.style.display = "grid";
    sku.style.gridTemplateColumns= "0.5fr 1fr 0.5fr";
    _mainbox_content.appendChild(sku);
    var firstName = document.createElement("div");
    firstName.style.display = "grid";
    var firstName_label = document.createElement("span");
    firstName_label.innerText = "前缀: ";
    firstName_label.style.fontFamily = "黑体";
    firstName.appendChild(firstName_label);
    var firstName_input = document.createElement("input");
    firstName_input.style.width = "75px";
    firstName_input.id = "sku_firstname";
    firstName_input.addEventListener("change",function(){
      tmp = `${this.value},${document.getElementById("sku_listname").value}`;
      localStorage.sku = tmp;
      setSKU(skuStyle);
    });
    firstName_input.style.border = "1px solid #cccccc";
    firstName.appendChild(firstName_input);
    sku.appendChild(firstName);
    var lastNameLen = document.createElement("div");
    lastNameLen.style.display = "grid";
    var lastNameLen_label = document.createElement("span");
    lastNameLen_label.innerText = "后缀最小长度: ";
    lastNameLen_label.style.fontFamily = "黑体";
    lastNameLen.appendChild(lastNameLen_label);
    var lastNameLen_input = document.createElement("input");
    lastNameLen_input.style.border = "1px solid #cccccc";
    lastNameLen_input.style.width = "90px";
    lastNameLen_input.id = "sku_listname";
    lastNameLen_input.addEventListener("input",function(){
      clearMistakeNumber(this)
      tmp = `${document.getElementById("sku_firstname").value},${this.value}`
      localStorage.sku = tmp;
      setSKU(skuStyle);
    });
    // lastName_input.addEventListener("change",function(){

    // });
    lastNameLen.appendChild(lastNameLen_input);
    sku.appendChild(lastNameLen);
    var cursorSku = document.createElement("div");
    cursorSku.style.display="grid";
    var cursorSku_label = document.createElement("span");
    cursorSku_label.innerText="sku指针";
    cursorSku_label.style.fontFamily="黑体";
    var cursorSku_input = document.createElement("input");
    cursorSku_input.style.border = "1px solid #cccccc";
    cursorSku_input.style.width = "145px";
    cursorSku_input.id = "sku_cursor";
    if(!localStorage.hasOwnProperty("cursor_sku")){
      localStorage.cursor_sku = '0';
    }
    cursorSku_input.value = localStorage.cursor_sku;
    cursorSku_input.addEventListener("input",function(){
      clearMistakeNumber(this)
      localStorage.cursor_sku = cursorSku_input.value;
      setSKU(skuStyle);
    });
    // cursorSku_input.addEventListener("change",function(){

    // });
    cursorSku.appendChild(cursorSku_label);
    cursorSku.appendChild(cursorSku_input);
    sku.appendChild(cursorSku);
    var reserve = document.createElement("div");
    reserve.style.marginTop = "5px";
    _mainbox_content.appendChild(reserve);
    var reserve_label = document.createElement("span");
    reserve_label.innerText = "库存";
    reserve_label.style.fontFamily = "黑体";
    reserve.appendChild(reserve_label);
    var reserve_input = document.createElement("input");
    reserve_input.style.width = "75px";
    reserve_input.style.border = "1px solid #cccccc";
    reserve_input.id = "reserve";
    reserve_input.addEventListener("input",function(){
      clearMistakeNumber(this)
    });
    reserve_input.addEventListener("change",function(){
      localStorage.reserve = this.value;
      setReserve();
    });
    reserve.appendChild(reserve_input);
    if (localStorage.hasOwnProperty("sku_isEnabled") && decodeBool(localStorage.sku_isEnabled)){
      _mainbox.querySelector("#sku_isEnabled").checked = true;
      _mainbox.querySelector("#sku_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("sku")){
      var tmp = localStorage.sku.split(",");
      firstName_input.value = tmp[0];
      lastNameLen_input.value = tmp[1];
    }
    if (localStorage.hasOwnProperty("reserve")){
      reserve_input.value = localStorage.reserve;
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "wholesale_isEnabled";
    _mainbox.querySelector("#wholesale_isEnabled").addEventListener("change",function(){
      localStorage.wholesale_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对批发折扣进行填充";
    base_content.appendChild(_mainbox);
    var wholesale = document.createElement("div");
    var wholesale_label = document.createElement("span");
    wholesale_label.innerText ="批发";
    wholesale_label.style.fontFamily = "黑体";
    wholesale.appendChild(wholesale_label);
    var wholesale_input = document.createElement("div");
    wholesale_input.style.display = "grid";
    wholesale_input.style.gridTemplateColumns = "1fr 1fr";
    var wholesale_input_1 = document.createElement("input");
    wholesale_input_1.id = "wholesale1";
    wholesale_input_1.addEventListener("change",function(){
      var tmp = `${wholesale_input_1.value},${wholesale_input_2.value}`;
      localStorage.wholesale = tmp;
      setWholesale();
    });
    wholesale_input_1.style.width = "150px";
    wholesale_input_1.style.border = "1px solid #cccccc";
    wholesale_input.appendChild(wholesale_input_1);
    var wholesale_input_2 = document.createElement("input");
    wholesale_input_2.id = "wholesale2";
    wholesale_input_2.addEventListener("change",function(){
      var tmp = `${wholesale_input_1.value},${wholesale_input_2.value}`;
      localStorage.wholesale = tmp;
      setWholesale();
    });
    wholesale_input_2.style.width = "150px";
    wholesale_input_2.style.border = "1px solid #cccccc";
    wholesale_input.appendChild(wholesale_input_2);
    wholesale.appendChild(wholesale_input);
    _mainbox_content.appendChild(wholesale)
    if (localStorage.hasOwnProperty("wholesale_isEnabled") && decodeBool(localStorage.wholesale_isEnabled)){
      _mainbox.querySelector("#wholesale_isEnabled").checked = true;
      _mainbox.querySelector("#wholesale_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("wholesale")){
      var tmp = localStorage.wholesale.split(",");
      wholesale_input_1.value = tmp[0];
      wholesale_input_2.value = tmp[1];
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "delivery_isEnabled";
    _mainbox.querySelector("#delivery_isEnabled").addEventListener("change",function(){
      localStorage.delivery_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对发货期限进行填充";
    base_content.appendChild(_mainbox);
    var delivery = document.createElement("div");
    var delivery_label = document.createElement("span");
    delivery_label.innerText = "发货期限";
    delivery_label.style.display = "block";
    delivery_label.style.fontFamily = "黑体";
    _mainbox_content.appendChild(delivery_label);
    var delivery_input = document.createElement("input");
    delivery_input.id = "delivery";
    delivery_input.addEventListener("change",function(){
      localStorage.deliveryDay = this.value;
      setDelivery();
    });
    delivery_input.width = "100px";
    delivery_input.style.border = "1px solid #cccccc";
    _mainbox_content.appendChild(delivery_input);
    if (localStorage.hasOwnProperty("delivery_isEnabled") && decodeBool(localStorage.delivery_isEnabled)){
      _mainbox.querySelector("#delivery_isEnabled").checked = true;
      _mainbox.querySelector("#delivery_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("deliveryDay")){
      delivery_input.value = localStorage.deliveryDay;
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "package_isEnabled";
    _mainbox.querySelector("#package_isEnabled").addEventListener("change",function(){
      localStorage.package_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对包装信息进行填充";
    base_content.appendChild(_mainbox);
    var weight = document.createElement("div");
    var weight_label = document.createElement("span");
    weight_label.innerText = "重量: ";
    weight_label.style.fontFamily = "黑体";
    weight.appendChild(weight_label);
    var weight_input = document.createElement("input");
    weight_input.style.width = "100px";
    weight_input.style.border = "1px solid #cccccc";
    weight_input.id = "weight";
    weight_input.addEventListener("input",function(){
      clearNoNumAndMinusDecimal3(this);
    });
    weight_input.addEventListener("change",function(){
      localStorage.weight = this.value;
      setWeight();
    });
    weight.appendChild(weight_input);
    _mainbox_content.appendChild(weight);

    var size = document.createElement("div");
    var size_label = document.createElement("span");
    size_label.innerText = "包装后尺寸: ";
    size_label.style.fontFamily = "黑体";
    size.appendChild(size_label);
    var size_input = document.createElement("div");
    size_input.style.display = "grid";
    size_input.style.gridTemplateColumns= "1fr 1fr 1fr";
    var size_input_1 = document.createElement("input");
    size_input_1.style.width = "100px";
    size_input_1.style.border = "1px solid #cccccc";
    size_input_1.id = "size_1";
    size_input_1.addEventListener("change",function(){
      var tmp = `${size_input_1.value},${size_input_2.value},${size_input_3.value}`;
      localStorage.size = tmp;
      setSize();
    });
    size_input.appendChild(size_input_1);
    var size_input_2 = document.createElement("input");
    size_input_2.style.width = "100px";
    size_input_2.style.border = "1px solid #cccccc";
    size_input_2.id = "size_2";
    size_input_2.addEventListener("change",function(){
      var tmp = `${size_input_1.value},${size_input_2.value},${size_input_3.value}`;
      localStorage.size = tmp;
      setSize();
    });
    size_input.appendChild(size_input_2);
    var size_input_3 = document.createElement("input");
    size_input_3.style.width = "100px";
    size_input_3.style.border = "1px solid #cccccc";
    size_input_3.id = "size_3";
    size_input_3.addEventListener("change",function(){
      var tmp = `${size_input_1.value},${size_input_2.value},${size_input_3.value}`;
      localStorage.size = tmp;
      setSize();
    });
    size_input.appendChild(size_input_3);
    size.appendChild(size_input);
    _mainbox_content.appendChild(size);
    if (localStorage.hasOwnProperty("package_isEnabled") && decodeBool(localStorage.package_isEnabled)){
      _mainbox.querySelector("#package_isEnabled").checked = true;
      _mainbox.querySelector("#package_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("weight")){
      weight_input.value = localStorage.weight;
    }
    if (localStorage.hasOwnProperty("size")){
      let tmp = localStorage.size.split(',');
      size_input_1.value = tmp[0];
      size_input_2.value = tmp[1];
      size_input_3.value = tmp[2];
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "postModels_isEnabled";
    _mainbox.querySelector("#postModels_isEnabled").addEventListener("change",function(){
      localStorage.postModels_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对运费模块进行填充";
    base_content.appendChild(_mainbox);
    var select = document.createElement("select");
    select.id = "PostModels";
    select.style.outline = "none";
    select.style.width = "100%";
    select.style.border = "none";
    for (var option of document.querySelectorAll("#freightTemplateId option")){
      select.appendChild(option.cloneNode(true));
    }
    select.addEventListener("change",function(){
      this.setAttribute("value",this.children[this.selectedIndex].getAttribute("value"));
      localStorage.PostModels = this.getAttribute("value");
      setPostModels();
    });
    _mainbox_content.appendChild(select);
    if (localStorage.hasOwnProperty("postModels_isEnabled") && decodeBool(localStorage.postModels_isEnabled)){
      _mainbox.querySelector("#postModels_isEnabled").checked = true;
      _mainbox.querySelector("#postModels_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("PostModels")){
      let trueOption = select.querySelector(`option[value='${localStorage.PostModels}']`);
      if(trueOption != undefined){
        trueOption.selected = true;
        var index = trueOption.index;
        select.selectedIndex = index;
      }
    }
  })();

  (async function (){
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox.querySelector("#_box_c_id").id = "resPerson_isEnabled";
    _mainbox.querySelector("#resPerson_isEnabled").addEventListener("change",function(){
      localStorage.resPerson_isEnabled = this.checked;
    });
    _mainbox.querySelector("._box_title").innerText = "对欧美负责人进行填充";
    base_content.appendChild(_mainbox);
    var select = document.createElement("select");
    select.id = "resPerson";
    select.style.outline = "none";
    select.style.width = "100%";
    select.style.border = "none";
    for (var option of document.querySelectorAll("#responsiblePersonId option")){
      select.appendChild(option.cloneNode(true));
    }
    select.addEventListener("change",function(){
      this.setAttribute("value",this.children[this.selectedIndex].getAttribute("value"));
      localStorage.resPerson = this.getAttribute("value");
      setResPerson();
    });
    _mainbox_content.appendChild(select);
    if (localStorage.hasOwnProperty("resPerson_isEnabled") && decodeBool(localStorage.resPerson_isEnabled)){
      _mainbox.querySelector("#resPerson_isEnabled").checked = true;
      _mainbox.querySelector("#resPerson_isEnabled").onchange();
    }
    if (localStorage.hasOwnProperty("resPerson")){
      var trueOption = select.querySelector(`option[value='${localStorage.resPerson}']`);
      if (trueOption != undefined){
        trueOption.selected= true;
        var index = trueOption.index;
        select.selectedIndex = index;
      }
    }
  })();

  (async function (){
    let setting = JSON.parse(localStorage.ToolSetting);
    var _mainbox = _box.cloneNode(true);
    var _mainbox_content = _mainbox.querySelector("._box_content");
    _mainbox_content.id = "tool_setting";
    _mainbox.querySelector("#_box_c_id").parentNode.removeChild(_mainbox.querySelector("#_box_c_id"));
    _mainbox.querySelector("._box_title").innerText = "设置";
    _check_box = document.createElement("div");
    _check_box_c = document.createElement("input");
    _check_box_c.setAttribute("type","checkbox");
    _check_box_c.style.marginTop = "2px";
    _check_box_c.id = "_check_box_Id";
    _check_box_l = document.createElement("span");
    _check_box_l.innerText = "示范文本";
    _check_box_l.style.fontFamily = "黑体";
    _check_box_l.style.userSelect = "none";
    _check_box_l.style.paddingLeft = "3px";
    _check_box_l.style.paddingRight = "3px";
    _check_box_l.className = "_checkbox_title";
    _check_box.appendChild(_check_box_c);
    _check_box.appendChild(_check_box_l);

    _radio_box = document.createElement("div");
    _radio_box_c = document.createElement("input");
    _radio_box_c.setAttribute("type","radio");
    _radio_box_c.style.marginTop = "2px";
    _radio_box_c.id = "_radio_box_Id";
    _radio_box_l = document.createElement("span");
    _radio_box_l.innerText = "示范文本";
    _radio_box_l.style.fontFamily = "黑体";
    _radio_box_l.style.userSelect = "none";
    _radio_box_l.style.paddingLeft = "3px";
    _radio_box_l.style.paddingRight = "3px";
    _radio_box_l.className = "_radiobox_title";
    _radio_box.appendChild(_radio_box_c);
    _radio_box.appendChild(_radio_box_l);

    _options_grop = document.createElement("div");
    _options_grop.style.padding = "3px"
    _options_grop.style.border = "1px solid #cccccc";
    _options_grop.style.borderRadius = "3px";
    _options_grop.style.marginTop = "8px";
    _options_grop_content = document.createElement("div");
    _options_grop_content.id = "_options_grop_content";
    _options_grop_content.style.display = "grid";
    _options_grop_content.style.gridTemplateColumns = "1fr 1fr 1fr";
    _options_grop_title = document.createElement("small");
    _options_grop_title.style.fontFamily = "黑体";
    _options_grop_title.style.position = "relative";
    _options_grop_title.style.top = "-12px";
    _options_grop_title.style.left = "10px";
    _options_grop_title.style.background = "white";
    _options_grop_title.innerText = "XX设置";
    _options_grop_title.className = "_setting_group_title";
    _options_grop.appendChild(_options_grop_title);
    _options_grop.appendChild(_options_grop_content);


    Basic_setting = _options_grop.cloneNode(true);
    Basic_setting.querySelector("._setting_group_title").innerText = "基本设置";
    Basic_setting_content = Basic_setting.querySelector("#_options_grop_content");
    Basic_setting_content.id = "basic_setting";
    _mainbox_content.appendChild(Basic_setting);
    //==============================




    SKU_setting = _options_grop.cloneNode(true);
    SKU_setting.querySelector("._setting_group_title").innerText = "SKU设置";
    SKU_setting_content = SKU_setting.querySelector("#_options_grop_content");
    SKU_setting_content.id = "sku_setting";
    _mainbox_content.appendChild(SKU_setting);
    //=============================
    IsDynamicallyAddSKU = _check_box.cloneNode(true);         //是否动态添加SKU
    IsDynamicallyAddSKU.querySelector("#_check_box_Id").id = "is_DynamicallyAddSKU";
    if (setting["sku_setting"]["isDynamicallyAddSKU"] === true){
      IsDynamicallyAddSKU.querySelector("#is_DynamicallyAddSKU").checked = true;
    }
    IsDynamicallyAddSKU.querySelector("#is_DynamicallyAddSKU").addEventListener("change",function(){
      setting["sku_setting"]["isDynamicallyAddSKU"] = this.checked
      localStorage.ToolSetting = JSON.stringify(setting);
      if (this.checked){
        SKUobserver.observe(table, SKUobserver_config);
        setSKU(skuStyle);
        setReserve();
      }else{
        SKUobserver.disconnect();
      }
    });
    IsDynamicallyAddSKU.querySelector("._checkbox_title").innerText = "动态填充";
    IsDynamicallyAddSKU.querySelector("._checkbox_title").addEventListener("click",function(){
      IsDynamicallyAddSKU.querySelector("#is_DynamicallyAddSKU").click();
    });
    SKU_setting_content.appendChild(IsDynamicallyAddSKU);
    //==============================
    Is16Encode = _check_box.cloneNode(true);
    Is16Encode.querySelector("#_check_box_Id").id = "is_16HexEncode";
    if(setting["sku_setting"]['is16hexEncode'] === true){
      Is16Encode.querySelector("#is_16HexEncode").checked = true;
    }
    Is16Encode.querySelector("#is_16HexEncode").addEventListener("change",function(){
      setting["sku_setting"]["is16hexEncode"] = this.checked;
      localStorage.ToolSetting = JSON.stringify(setting);
      setSKU(skuStyle);
    });
    Is16Encode.querySelector("._checkbox_title").innerText = "16进制编码";
    Is16Encode.querySelector("._checkbox_title").addEventListener("click",function(){
      Is16Encode.querySelector("#is_16HexEncode").click();
    });
    SKU_setting_content.appendChild(Is16Encode);




    SKU_style = _options_grop.cloneNode(true);
    SKU_style.querySelector("._setting_group_title").innerText = "SKU构成";
    SKU_style_content = SKU_style.querySelector("#_options_grop_content");
    SKU_style_content.id = "sku_style";
    _mainbox_content.appendChild(SKU_style);
    //=============================
    tmpFrom = document.createElement("form");
    IsSingle = _radio_box.cloneNode(true);
    IsSingle.querySelector("#_radio_box_Id").id = "is_Single";
    IsSingle.querySelector("#is_Single").setAttribute("name","sku-style");
    if(setting["sku_style"]['isSingle'] === true){
      IsSingle.querySelector("#is_Single").checked = true;
    }
    IsSingle.querySelector("#is_Single").addEventListener("change",function(){
      setting["sku_style"]["isSingle"] = this.checked;
      setting["sku_style"]["isPage"] = $("#is_Page")[0].checked;
      setting["sku_style"]["isBatch"] = $("#is_Batch")[0].checked;
      localStorage.ToolSetting = JSON.stringify(setting);
    });
    IsSingle.querySelector("._radiobox_title").innerText = "单个模式";
    IsSingle.querySelector("._radiobox_title").addEventListener("click",function(){
      IsSingle.querySelector("#is_Single").click();
      skuStyle = JSON.parse(localStorage.ToolSetting)["sku_style"];
      for([k,v] of Object.entries(skuStyle)){
        if(v){
          skuStyle = k;
          break;
        }
      }
      //更新skuStyle
    });
    SKU_style_content.appendChild(IsSingle);
    //=============================
    IsPage = _radio_box.cloneNode(true);
    IsPage.querySelector("#_radio_box_Id").id = "is_Page";
    IsPage.querySelector("#is_Page").setAttribute("name","sku-style");
    if(setting["sku_style"]['isPage'] === true){
      IsPage.querySelector("#is_Page").checked = true;
    }
    IsPage.querySelector("#is_Page").addEventListener("change",function(){
      setting["sku_style"]["isPage"] = this.checked;
      setting["sku_style"]["isSingle"] = $("#is_Single")[0].checked;
      setting["sku_style"]["isBatch"] = $("#is_Batch")[0].checked;
      localStorage.ToolSetting = JSON.stringify(setting);
    });
    IsPage.querySelector("._radiobox_title").innerText = "页模式";
    IsPage.querySelector("._radiobox_title").style.color ="#696969";
    IsPage.querySelector("#is_Page").setAttribute("disabled",true); // !
    IsPage.querySelector("#is_Page").style.pointerEvents = "none";  // !
    IsPage.querySelector("._radiobox_title").addEventListener("click",function(){
      IsPage.querySelector("#is_Page").click();
      skuStyle = JSON.parse(localStorage.ToolSetting)["sku_style"];
      for([k,v] of Object.entries(skuStyle)){
        if(v){
          skuStyle = k;
          break;
        }
      }
      //更新skuStyle
    });
    SKU_style_content.appendChild(IsPage);
    //==============================
    IsBatch = _radio_box.cloneNode(true);
    IsBatch.querySelector("#_radio_box_Id").id = "is_Batch";
    IsBatch.querySelector("#is_Batch").setAttribute("name","sku-style");
    if(setting["sku_style"]['isBatch'] === true){
      IsBatch.querySelector("#is_Batch").checked = true;
    }
    IsBatch.querySelector("#is_Batch").addEventListener("change",function(){
      setting["sku_style"]["isBatch"] = this.checked;
      setting["sku_style"]["isSingle"] = $("#is_Single")[0].checked;
      setting["sku_style"]["isPage"] = $("#is_Page")[0].checked;
      localStorage.ToolSetting = JSON.stringify(setting);
    });
    IsBatch.querySelector("._radiobox_title").innerText = "批次模式";
    IsBatch.querySelector("._radiobox_title").style.color = "#696969";
    IsBatch.querySelector("#is_Batch").setAttribute("disabled",true); // !
    IsBatch.querySelector("#is_Batch").style.pointerEvents = "none";  // !
    IsBatch.querySelector("._radiobox_title").addEventListener("click",function(){
      IsBatch.querySelector("#is_Batch").click();
      skuStyle = JSON.parse(localStorage.ToolSetting)["sku_style"];
      for([k,v] of Object.entries(skuStyle)){
        if(v){
          skuStyle = k;
          break;
        }
      }
      //更新skuStyle
    });
    SKU_style_content.appendChild(IsBatch);



    base_content.appendChild(_mainbox);
  })();

  (function(){
    setBrand();     //品牌
    setDelivery();    //发货期限
    setWholesale();   //批发
    setReserve();     //库存
    setSKU(skuStyle);         //SKU
    setWeight();      //重量
    setSize();        //尺寸
    setPostModels();  //运费模板
    setResPerson();   //欧美负责人
  })();

  (function(){
    let _div = document.getElementsByClassName("fixed-box")[0].children[1];

    let _btn = document.createElement("div");
    _btn.className = "navIcon";
    _btn.style.position= "relative";
    _btn.style.background= "#999999";
    _btn.addEventListener("click",function(event){
      event.stopPropagation();
      _btn.style.background = "#0099ff";
      _baseDiv.style.display = "block";
    });
    _btn.addEventListener("mouseout",function(){
      _btn.style.background = "#999999";
    });
    _btn.style.color= "white";
    let _p = document.createElement("p");
    _p.appendChild(document.createTextNode("预"));
    _p.style.display = "block";
    _p.style.position = "absolute";
    _p.style.fontSize = "17px";
    _p.style.top = "50%";
    _p.style.left = "50%";
    _p.style.transform = "translate(-50%,-50%)";
    _btn.appendChild(_p);
    _div.insertBefore(_btn,_div.children[_div.children.length - 1]);
    _btn.appendChild(_baseDiv);
  })();
  function decodeBool(s){
    if (s==='true'){
      return true;
    }
    else if(s==='false'){
      return false;
    }
  }
  function timesleep(t){          //阻塞式睡眠
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve();
      },t);
    });
  }

  function autoSelect_Brand(){
    var trueOption = document.querySelector("select[attrid='2'] option:not([data-cid='noValue']):not([data-cid='201512802'])");
    if (trueOption != undefined){
      trueOption.selected = true;
      var index = trueOption.index;
      var OptionName = trueOption.innerText;
      $("select[attrid='2']")[0].selectedIndex = index;
      $("select[attrid='2']")[0].parentNode.children[1].setAttribute("title",OptionName);
      $("select[attrid='2']")[0].parentNode.children[1].getElementsByTagName("span")[0].innerText = OptionName;
    }
  }       //自动选择第一个品牌
  function to16hexEncode(s,l){
    return zfill(parseInt(s).toString(16),l,"u");
  }   //16进制编码

  function zfill(s,l,a = 'l'){
    if(isNaN(s) && typeof(s) == 'number'){
      return ""
    }
    s = s.toString()
    while (s.length < l){
      s = "0" + s;
    }
    if (a === "l"){
      return s.toLowerCase();
    }else if (a === "u"){
      return s.toUpperCase();
    }
  }       //在字符串前补零到一定长度

  function setSKU(Mode){
    let setting = JSON.parse(localStorage.ToolSetting)["sku_setting"];
    let basicSetting = JSON.parse(localStorage.ToolSetting)["basic_setting"];
    if (localStorage.hasOwnProperty("sku_isEnabled") && decodeBool(localStorage.sku_isEnabled)){
      if(localStorage.hasOwnProperty("sku")){
        var skuCodeList = document.querySelectorAll("input[data-names='skuCode']");

        if (skuCodeList.length > 0){
          if (Mode === "isSingle"){
            for ([i,e] of Object.entries(skuCodeList)){
              let sku = localStorage.sku.split(",");
              if(setting["is16hexEncode"] === true){
                skuLast = to16hexEncode(parseInt(localStorage.cursor_sku)+parseInt(i),sku[1]);
              }else{
                skuLast = zfill(parseInt(localStorage.cursor_sku)+parseInt(i),sku[1]);
              }
              e.value = `${sku[0]}${skuLast}`
            }
          }
          else if (Mode === "isPage"){
            // colorList = [];
            // otherAttList = [];
            // for (color of Object.values(skuAttrArr)){
            //   if (skuCodeList['id'] === "14"){
            //     for(ck of skuCodeList['clickData']){
            //       var ckn = ck['nameEn'].split[' '];
            //       if (ckn.length > 1){
            //         ckn = `${ckn[0][0]}${ckn[1]}`;
            //       }else{
            //         ckn = ckn[0];
            //       }
            //       colorList.push(ckn);
            //     }
            //     break;
            //   }
            // }
            // for (Attr of Object.values(skuAttrArr)){
            //   if (! ['14','200007763'].includes(skuCodeList['id'])){
            //     for(ck of skuCodeList['clickData']){
            //       var ckn = ck['nameEn'];
            //       otherAttList.push(ckn);
            //     }
            //     break;
            //   }
            // }
            // for([index,input] of Object.entries($(".previewKeyUp"))){
            //   if(input.value !== ""){
            //     colorList[parseInt(index)] = input.value;
            //   }
            // }
            // var lastNameList = [];
            // if (colorList.length < 1){
            //   for (arr of otherAttList){
            //     lastNameList.appendChild(arr);
            //   }
            // }else{
            //   for (color of colorList){
            //     for (arr of otherAttList){
            //       lastNameList.appendChild(`${color}-${arr}`);
            //     }
            //   }
            // }
            // for ([i,e] of Object.entries(skuCodeList)){
            //   let sku = localStorage.sku.split(",");
            //   if(setting["is16hexEncode"] === true){
            //     sku[1] = to16hexEncode(sku[1]);
            //   }
            //   e.value = `${sku[0]}${sku[1]}${lastNameList[parseInt(i)]}`;
            // }
          }
          else if (Mode === "isBatch"){
            // otherAttList = [];
            // for (Attr of Object.values(skuAttrArr)){
            //   if (! ['14','200007763'].includes(skuCodeList['id'])){
            //     for(ck of skuCodeList['clickData']){
            //       var ckn = ck['nameEn'];
            //       otherAttList.push(ckn);
            //     }
            //     break;
            //   }
            // }
            // var lastNameList = [];
            // var colorList = [];
            // for (color of Object.values(skuAttrArr)){
            //   if (skuCodeList['id'] === "14"){
            //     for(ck of skuCodeList['clickData']){
            //       var ckn = ck['nameEn'].split[' '];
            //       if (ckn.length > 1){
            //         ckn = `${ckn[0][0]}${ckn[1]}`;
            //       }else{
            //         ckn = ckn[0];
            //       }
            //       colorList.push(ckn);
            //     }
            //     break;
            //   }
            // }
            // for([index,input] of Object.entries($(".previewKeyUp"))){
            //   if(input.value !== ""){
            //     colorList[parseInt(index)] = input.value;
            //   }
            // }
            // if(colorList.length > 0){
            //   var tmp = [];
            //   for (color of colorList){
            //     lastNameList.appendChild(otherAttList);
            //   }
            // }else{
            //   lastNameList.appendChild(otherAttList);
            // }
            // for ([i,e] of Object.entries(skuCodeList)){
            //   let sku = localStorage.sku.split(",");
            //   if(setting["is16hexEncode"] === true){
            //     sku[1] = to16hexEncode(sku[1]);
            //   }
            //   e.value = `${sku[0]}${sku[1]}${lastNameList[parseInt(i)]}`;
            // }
          }
        }else{
          let sku = localStorage.sku.split(",");
          if(setting["is16hexEncode"] === true){
            skuLast = to16hexEncode(parseInt(localStorage.cursor_sku)+parseInt(i),sku[1]);
          }else{
            skuLast = zfill(parseInt(localStorage.cursor_sku),sku[1]);
          }
          document.getElementById("skuCode").value = `${sku[0]}${skuLast}`
        }
      }
    }
  } //该函数设置SKU
  function setReserve(){
    if(localStorage.hasOwnProperty("sku_isEnabled") && decodeBool(localStorage.sku_isEnabled)){
      if (localStorage.hasOwnProperty("reserve")){
        llist = document.querySelectorAll("input[data-names='ipmSkuStock']");
        if (llist.length > 0){
          for (i of llist){
            i.value = localStorage.reserve;
            i.dispatchEvent(m_click);
          }
        }else{
          document.getElementById("ipmSkuStock").value = localStorage.reserve;
        }
      }
    }
  }       //该函数用于设置库存
  function setWholesale(){
    if (localStorage.hasOwnProperty("wholesale_isEnabled") && localStorage.wholesale_isEnabled){
      if (!document.getElementById("wholeSale").checked){
        document.getElementById("wholeSale").click();
      }
      if(localStorage.hasOwnProperty("wholesale")){
        var tmp = localStorage.wholesale.split(",");
        $("#bulkOrder")[0].value = tmp[0];
        $("#bulkOrder")[0].dispatchEvent(m_input);
        $("#bulkDiscount")[0].value = tmp[1];
        $("#bulkDiscount")[0].dispatchEvent(m_input);
      }
    }
  }   //该函数用于设置批发选项
  function setBrand(){
    if (localStorage.hasOwnProperty("autoSelectBrand") && decodeBool(localStorage.autoSelectBrand)){
      autoSelect_Brand();
      return true
    }
    if (localStorage.hasOwnProperty("brand_isEnabled") && decodeBool(localStorage.brand_isEnabled)){
      if (localStorage.hasOwnProperty("brand_v")){
        var brandId = localStorage.brand_v;
        var trueBrand = $(`select[attrid='2'] option[data-cid=${brandId}]`)[0];
        if (trueBrand != undefined){
          let index = $(`select[attrid='2'] option[data-cid=${brandId}]`)[0].index;
          let brandName = $(`select[attrid='2'] option[data-cid=${brandId}]`)[0].innerText;
          $(`select[attrid='2'] option[data-cid=${brandId}]`)[0].selected = true;
          $(`select[attrid='2']`)[0].selectedIndex = index;
          $(`select[attrid='2']`)[0].parentNode.children[1].setAttribute("title",brandName);
          $(`select[attrid='2']`)[0].parentNode.children[1].getElementsByTagName("span")[0].innerText = brandName;
        }
      }
    }
  }       //该函数用来设置品牌
  function setDelivery(){
    if(localStorage.hasOwnProperty("delivery_isEnabled") && decodeBool(localStorage.delivery_isEnabled)){
      if(localStorage.hasOwnProperty("deliveryDay")){
        document.getElementById("deliveryTime").value = localStorage.deliveryDay;
        document.getElementById("deliveryTime").dispatchEvent(m_input);
      }
    }
  }   //该函数用于设置发货期限
  function setWeight(){
    if(localStorage.hasOwnProperty("package_isEnabled") && decodeBool(localStorage.package_isEnabled)){
      if (localStorage.hasOwnProperty("weight")){
        $("#grossWeight")[0].value = localStorage.weight;
        $("#grossWeight")[0].dispatchEvent(m_input);
      }
    }
  }
  function setSize(){
    if(localStorage.hasOwnProperty("package_isEnabled") && decodeBool(localStorage.package_isEnabled)){
      if (localStorage.hasOwnProperty("size")){
        tmp = localStorage.size.split(",");
        document.getElementById("packageLength").value = tmp[0];
        document.getElementById("packageWidth").value = tmp[1];
        document.getElementById("packageHeight").value = tmp[2];
        document.getElementById("packageHeight").dispatchEvent(m_input);
      }
    }
  }       //该函数用于设置发货包裹尺寸
  function setPostModels(){
    if(localStorage.hasOwnProperty("postModels_isEnabled") && decodeBool(localStorage.postModels_isEnabled)){
      if (localStorage.hasOwnProperty("PostModels")){
        var trueOption = $(`option[value='${localStorage.PostModels}'`)[0];
        if (trueOption != undefined){
          let index =trueOption.index;
          let modelName = trueOption.innerText;
          trueOption.selected = true;
          $("#freightTemplateId")[0].value = trueOption.value;
          $("#freightTemplateId")[0].selectedIndex = index;
          $("#freightTemplateId_chosen")[0].setAttribute("title",modelName);
          $("#freightTemplateId_chosen")[0].getElementsByTagName("span")[0].innerText = modelName;
        }
      }
    }
  }   //该函数用于设置邮费模块
  function setResPerson(){
    if(localStorage.hasOwnProperty("resPerson_isEnabled") && decodeBool(localStorage.resPerson_isEnabled)){
      if(localStorage.hasOwnProperty("resPerson")){
        var trueOption = $("#responsiblePersonId")[0].querySelector(`option[value="${localStorage.resPerson}"]`);
        if(trueOption != undefined){
          trueOption.selected = true;
          $("#responsiblePersonId")[0].value = trueOption.value;
          $("#responsiblePersonId")[0].selectedIndex = trueOption.index;
        }
      }
    }
  } //该函数用于设置欧美负责人
  let table = document.getElementById("skuVariantList");//当用户添加变种就自动添加SKU
  table = table.children[0];
  document.body.addEventListener("keydown",function(event){
    if(event.keyCode===192){
      IsDynamicallyAddSKU.querySelector("#is_DynamicallyAddSKU").click();
    }
  });
  // 配置需要监视的变化类型和属性
  const SKUobserver_config = { childList: true, subtree: true, characterData: true};
  // 创建一个 MutationObserver 实例
  const SKUobserver = new MutationObserver((mutations) => {
    // 在元素发生改变时执行的回调函数
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        SKUobserver.disconnect();
        setReserve();
        setSKU(skuStyle);
        SKUobserver.observe(table, SKUobserver_config);
      }
    });
  });
  // 开始监听元素的变化
  if(toolSetting['sku_setting']['isDynamicallyAddSKU']){
    SKUobserver.observe(table, SKUobserver_config);
  }

  (function(){
    let toSubmitBnt = document.getElementsByClassName("toSubmit");
    for (Bnt of toSubmitBnt){
      Bnt.addEventListener("click",function(){
        if(localStorage.hasOwnProperty("sku") && localStorage.hasOwnProperty("cursor_sku")){
          if (skuStyle === "isSingle"){
            var Skus = document.querySelectorAll("input[data-names='skuCode']");
            if(Skus.length < 1){
              Skus = [document.querySelector("#skuCode")];
            }
            localStorage.cursor_sku = parseInt(localStorage.cursor_sku)+Skus.length;
          }
        }
      });
    }
  })();
}