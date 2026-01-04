// ==UserScript==
// @name         Methods view
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Methods viewing
// @author       You
// @match        https://managment.io/en/admin/banktransfer
// @grant GM_xmlhttpRequest
// @grant        *
// @downloadURL https://update.greasyfork.org/scripts/432567/Methods%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/432567/Methods%20view.meta.js
// ==/UserScript==

var timerStart = Date.now();
const days_days = parseInt( localStorage.getItem('days_lookup') || 7);



const excluding = {
  ids : [],
  recount : function () {
    ids = localStorage.getItem('exclude_list').match(/\d+/g) || ['']
    
    
  },
  getIds : function (params) {
    return ids;
  }
}

const replacing = {
  //TODO replace
}

excluding.recount()
console.log("%c 7️⃣: texts ", "font-size:16px;background-color:#3eca7e;color:white;", excluding.getIds())

const const_els = {
 section : document.createElement('div')
}

function delete_els_by_class_name(classname) {
  const els = document.getElementsByClassName(classname)
  
  while (els.length) {
    
    for (let index = 0; index < els.length; index++) {
      
      console.log("%c 💣: removed ", "font-size:16px;background-color:#649bd0;color:white;", els[index])
      els[index].remove();
    }
    
  }
  
  // console.log("%c 👗: delete_els_by_class_name   done", "font-size:16px;background-color:#621933;color:white;", classname)
}

function amountPrepare(string) {
  if (string<1000)  return string;
  // console.log("%c 🇱🇰: amountPrepare -> string ", "font-size:16px;background-color:#83779f;color:white;", string)
  const mystring = string+'' 
  const divider = (mystring.indexOf('.')!=-1) ? mystring.indexOf('.') : mystring.length
  // console.log("%c 🚀: amountPrepare -> divider ", "font-size:16px;background-color:#104d9d;color:white;", divider)

let result=mystring.substr(divider,mystring.length)
let counter=0;
for (let index = divider-1; index > -1 ; index--) {
  const element = mystring[index];
  result = (((counter%3)==0)&&counter!=0) ? element+' '+result : element+result;
  counter++;
}
return result;
  //  console.log("%c 🏷️: amountPrepare -> divider ", "font-size:16px;background-color:#70972d;color:white;", result)
}
// amountPrepare('12341234.3214')
// amountPrepare('12341234')

// console.log("%c 🍟: days_days ", "font-size:16px;background-color:#cd6486;color:white;", days_days)

const make_req = true;

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

var today = new Date();

var dd = String(today.getDate()).padStart(2, "0");

var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!

var yyyy = today.getFullYear();


function getDateSubstr(days ) {
  var last_month;
if (mm > 2) {
  last_month = mm - 1;
} else {
  last_month = 12;
  yyyy--;
}

var dd_from;
var mm_from = mm;
if (dd > days) {
  dd_from = dd - days;
} else {
  dd_from = daysInMonth(last_month, yyyy) - (days - dd);
  mm_from = last_month;
}
return dd_from + "." + mm_from + "." + yyyy;
}
const prev_day = getDateSubstr( days_days );



const week_ago = prev_day

// console.log("%c 😇: prev_day ", "font-size:16px;background-color:#77f29d;color:black;", prev_day)
 
const my_today = dd + "." + mm + "." + yyyy;

console.log('week_ago '+week_ago + "  my_today " + my_today);
console.log('prev_day '+prev_day + "  my_today " + my_today);
// July

// console.log(daysInMonth(mm,yyyy));


let show_all_columns = localStorage.getItem("show_all_columns") || "true";
var dep_eq_wit = localStorage.getItem("dep_eq_wit") || "true";

(function () {
  // 'use strict';
  // Example POST method implementation:

  let provs = [];
  function my_hide(el) {
    el.style.visibility = "collapse";
    el.style.width = "0";
    el.style.display = "none";
  }

  function show_all_table() {
    const white = document.getElementsByClassName("wrap-white")[0];

    // white.style.height=document.body.scrollHeight+'px';

    const elements = document
      .getElementById("parent_table")
      .getElementsByTagName("tr");
    for (let index = 0; index < elements.length; index++) {
      elements[index].style.visibility = "visible";
    }
  }

  function check_if_any_includes(str, arr) {
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (str.includes(element)) return element;
    }
    return false;
  }

  function rebuild_by_filters() {
    show_all_table();

    const nodes = document.querySelector("#boxes_parent").childNodes;
    let child_texts = [];

    for (let index1 = 0; index1 < nodes.length; index1++) {
      const element = nodes[index1];
      if (element.getAttribute("checked") == "true")
        child_texts.push(element.outerText.toLowerCase());
    }

    const nodes_meth = document.querySelector("#method_div").childNodes;

    for (let index1 = 0; index1 < nodes_meth.length; index1++) {
      const element = nodes_meth[index1];
      if (element.getAttribute("checked") == "true")
        child_texts.push(element.outerText.toLowerCase());
    }

    // document.querySelector("#boxes_parent").childNodes
    if (child_texts.length == 0) return;
    elements = document
      .getElementById("parent_table")
      .getElementsByTagName("tr");

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      if (element.classList.contains("table-head")) continue;

      if (
        !check_if_any_includes(element.innerText.toLowerCase(), child_texts)
      ) {
        element.style.visibility = "collapse";
      } else {
        element.style.visibility = "visible";
        for (let index2 = index; index2 > 0; index2--) {
          if (elements[index2].classList.contains("method_tr")) {
            elements[index2].style.visibility = "visible";
            break;
          }
        }
      }
    }
  }
  function create_base()
  {
 //TODO styles

 var css = `
 .color_reset{
   border-radius: 5px;
   border: 1px solid #e0e0e0;
  transition:box-shadow 30s ease;
  box-shadow: 0px 5px 37px 1px rgba(55, 146, 216, 0.69) inset;

   
 }
 .color_timer{
   border-radius: 5px;
   border: 1px solid #e0e0e0;

   transition:opacity 1s ease;
   box-shadow: 0px 5px 37px 1px transparent inset;
 }
 td input{
   font-size: x-large;
 }
 .td_banks{
  //  width: 250px;
 }
 .controls{
   display: flex;
   flex-direction: row;
  
   align-items: center;
 }
 .my_check_box{

   width: 1em;
   height: 1em;
  
   
}

 .filterdiv_firstline{    
   display: flex;
 flex-direction: row;
 width: 100%;
 align-items: baseline;
 padding: 1em;
}

 .switch_button{
   width: auto;
   margin-right: 1em;
 }
 .switch_button i{
   margin-right: 1em;
 }
 .my_textarea{
   padding: 5px;
   border: 1px solid;
   width: 100%;
   height: 100%;
   background: white;
 }
 #parent_table > tr > th:nth-child(5)
 {
   
 }

 .clickable{
   cursor: pointer;

 }

 .clickable:hover{
   color: #34c9eb;
   
 }
 #boxes_parent{
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
   flex-flow: row wrap;
 }
 #filterdiv{

   margin-top: 2em;
   // height: 3em;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: center;
   border: 1px solid #bdc3d1;
   border-radius: 3px;
   padding: 1em 0.5em;


 }
 #method_div{
   margin-top: 2em;
   // height: 3em;
   display: flex;
   justify-content: space-between;
   flex-flow: row wrap;
   align-items: center;
   border: 1px solid #bdc3d1;
   border-radius: 3px;
   padding: 1em 0.5em;
 }
 .checkbox_provs
 {
   
   border-radius: 5px;
   padding: 0.5em;
   margin-left: 1em;
   border: 1px dashed transparent;

 }
 .checkbox_provs[checked="true"] {
   border: 1px solid #505b72;

 }

 .checkbox_provs:hover
 {
   border: 1px dashed #31c1d2;
   cursor: pointer;
 }
 .method_tr{
    border-left: 10px solid #31c1d2;

 }

 .method_tr::after{
   border-left: 3px solid white;
}
#settings_wrap textarea{
  border: 1px solid;
  padding:10px;
}
#settings_wrap{
  transform: translate(-50%, -50%);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);

  padding:10px;
  background-color: white;
   
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 5px;
  display: none;
  flex-direction: column;
}
.modal_close{
  width: 40px;
  position: absolute;
  top: 0;
  margin-right: auto;
  align-self: flex-end;
  background-color: #cf4540;
  color: #fff;
}

#filter{
  margin-top: 2em; 
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
  border: 1px solid #bdc3d1;
  border-radius: 3px;
  padding: 1em 0.5em;
}
//TODO styles end
 `;
 var style = document.createElement("style");

 if (style.styleSheet) {
   style.styleSheet.cssText = css;
 } else {
   style.appendChild(document.createTextNode(css));
 }

 document.getElementsByTagName("head")[0].appendChild(style);

 const settings = document.createElement('div')
settings.id='settings_wrap'
 settings.innerHTML=`

 <button id="close_settings" class="btn btn-danger modal_close"><i class="fa fa-times"></i></button>
 <div id="excludes">
 <h2>Список исключённых</h2>
 <h3>Введите агентов которых вы хотите скрыть</h3>
 <textarea name="" id="exclude_list" cols="30" rows="10" placeholder='В каждой строчке должно быть как минимум id агента'></textarea>
 </div>
 
 `
 document.body.appendChild(settings)


 document.getElementById('exclude_list').addEventListener('keyup',function (params) {
   const text =  document.getElementById('exclude_list').value;
   localStorage.setItem('exclude_list',text)
   console.log("%c ❌: text ", "font-size:16px;background-color:#90b5f0;color:white;", JSON.stringify(text))
 })
 
 document.getElementById('close_settings').addEventListener('click',function (params) {
   document.getElementById('settings_wrap').style.display='none'
  //  create_structure();
 })





 

 


 


 const other_settings = document.createElement("div");


 const local_days = document.createElement('div')
 local_days.innerHTML=`
<b>Количество дней</b>
<input id="days_lookup" type="text" style="border: 1px solid; border-radius: 5px; width: 10em; margin-left: 3em; margin-right: auto; padding: 2px;"/>
<button id='apply_days' class="btn btn-success btn-quirk switch_button" >Обновить</button>
 `
 other_settings.appendChild( local_days )


 

 const accurate_button = document.createElement("button");

 accurate_button.className = "btn btn-success btn-quirk switch_button";

 accurate_button.innerHTML =
   dep_eq_wit == "true"
     ? ` <i class="fas fa-toggle-off"></i>Точная настройка  `
     : `<i class="fas fa-toggle-on"></i>Точная настройка  `;

 accurate_button.addEventListener("click", function (params) {

   dep_eq_wit = dep_eq_wit == "true" ? "false" : "true";

   localStorage.setItem("dep_eq_wit", dep_eq_wit);

   create_structure();

 });

 if (show_all_columns == "true")
   other_settings.appendChild(accurate_button);




 //TODO filterdiv

 const switch_button = document.createElement("button");
 switch_button.title = "Кнопка переключает показ траффика";
 switch_button.className = "btn btn-success btn-quirk switch_button";
 //  switch_button.textContent= 'Переключить'
 switch_button.innerHTML =
   show_all_columns == "true"
     ? ` <i class="fas fa-toggle-on"></i>Трафик  `
     : `<i class="fas fa-toggle-off"></i>Трафик  `;
 other_settings.appendChild(switch_button);

 switch_button.addEventListener("click", function (params) {
   show_all_columns = show_all_columns == "true" ? "false" : "true";
   localStorage.setItem("show_all_columns", show_all_columns);
   create_structure();
 });
const filter_filter = document.createElement("div");
filter_filter.id='filter';
 const filterp = document.createElement("span");
 filterp.textContent = "Фильтровать";

 const filterinput = document.createElement("input");
 //TODO filterinput

 filterinput.style.border = "1px solid";
 filterinput.style.borderRadius = "5px";
 filterinput.style.width = "10em";
 filterinput.style.marginLeft = "3em";
 filterinput.style.marginRight = "auto";
 filterinput.style.padding = "2px";

 filterinput.addEventListener("keyup", (event) => {
   show_all_table();

   if (filterinput.value == "") {
     rebuild_by_filters();
     return;
   }
   elements = document
     .getElementById("parent_table")
     .getElementsByTagName("tr");
   for (let index = 0; index < elements.length; index++) {
     const element = elements[index];
     if (element.classList.contains("table-head")) continue;

     if (
       !element.innerText
         .toLowerCase()
         .includes(filterinput.value.trim().toLowerCase())
     ) {
       element.style.visibility = "collapse";
     } else {
       element.style.visibility = "visible";
       for (let index2 = index; index2 > 0; index2--) {
         if (elements[index2].classList.contains("method_tr")) {
           elements[index2].style.visibility = "visible";
           break;
         }
       }
     }
   }
 });

 filter_filter.appendChild(filterp);
 const button_settings = document.createElement('button')
 button_settings.addEventListener('click',function (params) {
   document.getElementById('settings_wrap').style.display='flex'
  
   document.getElementById('exclude_list').value =  localStorage.getItem('exclude_list')
   console.log(
     "%c 4️⃣: JSON.parse( localStorage.getItem('exclude_list')) ", 
   "font-size:16px;background-color:#1d0c5a;color:white;", 
   document.getElementById('exclude_list').value)


   



 })
 button_settings.style.marginLeft='auto'
 button_settings.className='btn btn-success btn-quirk switch_button'
 button_settings.innerHTML=`
 <i class="fas fa-cogs"></i>Настройки 
 `
 //TODO append methods

 filter_filter.appendChild(filterinput);
 filter_filter.appendChild(button_settings);

  other_settings.className = "filterdiv_firstline";
 
  settings.appendChild(other_settings);

  const parenta = document.querySelector("#app > div > div.wrap-white.block");
  
  parenta.appendChild(filter_filter)
  
  // settings.appendChild(filterdiv);

//  parenta.appendChild(section);

 

 const local_days_input = document.getElementById('days_lookup')
 // console.log("%c 🇹🇰: functioncreate_structure -> local_days_input ", "font-size:16px;background-color:#187263;color:white;", local_days_input)

 local_days_input.value = days_days

 document.getElementById('apply_days').addEventListener('click',function (event) {
   create_structure()
 })
  }
  function create_structure() {
    //TODO create_structure

  excluding.recount();
   localStorage.setItem('days_lookup',document.getElementById('days_lookup').value )

    timerStart = Date.now();
    delete_els_by_class_name('recurring_element')

    const parenta = document.querySelector("#app > div > div.wrap-white.block");
    const method_div = document.createElement("div");
    method_div.id = "method_div";
    method_div.className = 'recurring_element'
    parenta.appendChild(method_div);
 
    const filterdiv = document.createElement("div");
    filterdiv.className = "title recurring_element";
    filterdiv.id = "filterdiv";
    parenta.appendChild(filterdiv)

    
    const section = document.createElement("section");
    section.style.marginTop = "2em";
    section.className = "table-vertical long_table recurring_element"; //scrollbar
    // const_els.section=section;
    parenta.appendChild(section);

    const table = document.createElement("table");
    table.id = "parent_table";
    // table.id = "parent_table";
    section.appendChild(table);
    const tr_th = document.createElement("tr");
    tr_th.className = "table-head";
    table.appendChild(tr_th);
    const th_methods = document.createElement("th");
    th_methods.innerHTML = "Methods";
    tr_th.appendChild(th_methods);

    const th_providers = document.createElement("th");
    th_providers.style.width = "30%";
    th_providers.innerHTML = "Providers";
    tr_th.appendChild(th_providers);

    const th_check = document.createElement("th");
    th_check.innerHTML = "Check";
    tr_th.appendChild(th_check);

    const th_dep = document.createElement("th");
    th_dep.innerHTML = "Deposit";
    if (dep_eq_wit == "true") th_dep.innerHTML = "TRAFIK";
    tr_th.appendChild(th_dep);

    const th_with = document.createElement("th");
    th_with.innerHTML = "Withdrawal";
    if (!(dep_eq_wit == "true")) tr_th.appendChild(th_with);

    if (show_all_columns != "true") {
      my_hide(th_dep);
      my_hide(th_with);
      my_hide(th_check);
    }

    const th_banks = document.createElement("th");

    // th_banks.style.width = "10%";
    th_banks.innerHTML = "Banks";
    th_banks.className = "td_banks";
    tr_th.appendChild(th_banks);

    const th_notes = document.createElement("th");
    th_notes.innerHTML = "Notes";
    tr_th.appendChild(th_notes);

    var ul = document.querySelector(
      "#bank_transfer > div > div:nth-child(1) > div > div.multiselect__content-wrapper > ul"
    );

    var node = "";
    var providers = [];
    var sometext = "";
    for (let index = 3; index < ul.childNodes.length - 3; index++) {
      node = ul.childNodes[index].textContent.toLowerCase();

      node = node.replaceAll("google", "Google");
      node = node.replaceAll("bkash", "Bkash");
      node = node.replaceAll(
        "wqs melbet jazzcash (#5022)",
        "wqs jazzcash melbet (#5022)"
      );

      sometext = node.split(" ")[1];
      if (!provs.includes(node.split(" ")[0])&& !excluding.getIds().some( el=> el==node.match(/\d+/g))) {
        provs.push(node.split(" ")[0]);
        // console.log("%c 💅: functioncreate_structure -> node.split()[0] ", "font-size:16px;background-color:#1d0f6b;color:white;", node.split(" ")[0])
      }
      if (!providers.includes(sometext)&& !excluding.getIds().some( el=> el==node.match(/\d+/g))) {
      // console.log("%c 💈: functioncreate_structure -> excluding.ids ", "font-size:16px;background-color:#151988;color:white;", excluding.ids)
        
        // console.log("%c 🚹: functioncreate_structure -> node.match(/\d+/g) ", "font-size:16px;background-color:#2c0390;color:white;", node.match(/\d+/g))
        providers.push([sometext, node.trim()]);
      }
    }
    providers.sort();
    provs.sort();
    const boxes_parent = document.createElement("div");
    boxes_parent.id = "boxes_parent";
boxes_parent.className='recurring_element'
    for (let index_p = 0; index_p < provs.length; index_p++) {
      const element = provs[index_p];
      const box = document.createElement("div");
      box.textContent = element;
      box.className = "checkbox_provs";
      box.id = "checkbox_" + element.toLowerCase();

      box.setAttribute(
        "checked",
        localStorage.getItem("checkbox_" + element.toLowerCase()) == "true" ||
          false
      );


      box.addEventListener("click", (event) => {
        const newbox = document.getElementById(
          "checkbox_" + element.toLowerCase()
        );

        newbox.setAttribute(
          "checked",
          !(newbox.getAttribute("checked") == "true")
        );

        localStorage.setItem(
          "checkbox_" + element.toLowerCase(),
          newbox.getAttribute("checked")
        );

        rebuild_by_filters();
      });

      boxes_parent.appendChild(box);
    }

    document.getElementById("filterdiv").appendChild(boxes_parent);
    const mylabel = document.createElement("label");
    mylabel.textContent = "";

    for (let index = 0; index < providers.length; index++) {
      const method = providers[index][0];
      const method_id = providers[index][0];
      const provider = providers[index][1];

      if (index == 0) {
        method_shower(method);

        provider_shower(method, provider);

        continue;
      }

      if (providers[index - 1][0] == method) {
        provider_shower(method, provider);
      } else {
        method_shower(method);
        provider_shower(method, provider);
      }
    }

    rebuild_by_filters();
  }


  function method_shower(method) {


    const box = document.createElement("h3");
    box.textContent = method;
    box.className = "checkbox_provs";
    box.id = "checkbox_" + method.toLowerCase();

    box.setAttribute(
      "checked",
      localStorage.getItem("checkbox_" + method.toLowerCase()) == "true" ||
        false
    );


    box.addEventListener("click", (event) => {
      const newbox = document.getElementById(
        "checkbox_" + method.toLowerCase()
      );

      newbox.setAttribute(
        "checked",
        !(newbox.getAttribute("checked") == "true")
      );

      localStorage.setItem(
        "checkbox_" + method.toLowerCase(),
        newbox.getAttribute("checked")
      );

      rebuild_by_filters();
    });

    method_div.appendChild(box);

    ////

    const tr = document.createElement("tr");
    // tr.style.marginTop='1em'
    tr.className = "method_tr";
    document.getElementById("parent_table").appendChild(tr);

    const td_method = document.createElement("td");
    td_method.innerHTML = method;
    tr.appendChild(td_method);

    const td_button = document.createElement("td");
    const button = document.createElement("button");
    button.className = "btn btn-success btn-quirk";

    button.addEventListener("click", (event) => {
      // alert(method.toLowerCase() + "_active")
      let counter_active = 0;
      const foundlings = document.getElementsByClassName(
        method.toLowerCase() + "_active"
      );
      let output =
        "Включите метод " + method + " на пополнение и на вывод и распределите трафик, пожалуйста: \r\n";
      for (let index = 0; index < foundlings.length; index++) {
        const dep_val =
          foundlings[index].parentNode.nextSibling.nextSibling.childNodes[0]
            .value;
        const wit_val =
          foundlings[index].parentNode.nextSibling.nextSibling.nextSibling
            .childNodes[0].value;
        const method = foundlings[index].childNodes[0].textContent;

        const dep_text =
          dep_val != "0" ? "включен: " + dep_val + "%" : "ВЫКЛЮЧЕН";
        const wit_text =
          wit_val != "0" ? "включен: " + wit_val + "%" : "ВЫКЛЮЧЕН";

        // if(dep_val!='0'||wit_val!='0')
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          const res_text =
            (dep_val == "0" && wit_val == "0")
              ? method + " выключен на снятия и депозиты"
              : method + " ввод " + dep_text + ", вывод " + wit_text;
          counter_active++;
          if (!(dep_eq_wit == "true")) output += res_text + "\r\n";
          else 
          output += method + " на ввод и вывод " + dep_text + "\r\n";
        }
      }
      if (foundlings.length > 0) navigator.clipboard.writeText(output);
      if (counter_active == 0)
        navigator.clipboard.writeText("Отключите, пожалуйста, метод " + method+ " на пополнение и на вывод");

      var ofs = 0;

      const interval = window.setInterval(function () {
        if (foundlings.length > 0)
          button.style.backgroundColor =
            "rgba(255,255,255," + Math.abs(Math.sin(ofs)) + ")";
        else
          button.style.backgroundColor =
            "rgba(255,0,0," + Math.abs(Math.sin(ofs)) + ")";

        ofs += 0.08;
        if (ofs > 3.1) {
          clearInterval(interval);
          button.style.backgroundColor = "#259dab";
        }
      }, 10);
    });

    button.innerHTML = "Copy active";

    if (show_all_columns == "true") td_button.appendChild(button);
    tr.appendChild(td_button);

    const td_empty = document.createElement("td");
    const button_eq = document.createElement("button");

    button_eq.addEventListener("click", function (params) {});

    button_eq.textContent = "divide";
    button_eq.className = "btn btn-success btn-quirk ";
    // td_empty.appendChild(button_eq)
    tr.appendChild(td_empty);

    const dep_info = document.createElement("td");
    dep_info.innerHTML = localStorage.getItem(method + "_dep_info") || "0";
    dep_info.id = method + "_dep_info";

    tr.appendChild(dep_info);

    const wit_info = document.createElement("td");
    wit_info.innerHTML = localStorage.getItem(method + "_wit_info") || "0";
    wit_info.id = method + "_wit_info";

    tr.appendChild(wit_info);

    if (dep_eq_wit == "true") my_hide(wit_info);

    const td_empty2 = document.createElement("td");
    td_empty2.className = "td_banks";
    tr.appendChild(td_empty2);

    if (show_all_columns != "true") {
      dep_info.style.visibility = "hidden";
      dep_info.style.width = "0";

      wit_info.style.visibility = "hidden";
      my_hide(td_empty2);
      // const td_empty = document.createElement("td");

      my_hide(button_eq);
    }
  }

  function provider_shower(method, provider, method_id) {
    //TODO provider_shower

    const tr = document.createElement("tr");
    tr.className = "m_method_" + method;

    document.getElementById("parent_table").appendChild(tr);

    const td_empty = document.createElement("td");
    tr.appendChild(td_empty);

    const td_provider = document.createElement("td");
    td_provider.id = "provider_" + method + "_" + provider.split(" ")[0];
    tr.appendChild(td_provider);

    const checkbox = document.createElement("td");
    checkbox.className = "controls";
    checkbox.innerHTML = `
    <input type="checkbox" class='my_check_box' id="is_enabled_${method}_${
      provider.split(" ")[0]
    }"/>
    
    <input type="range" min="0" max="100" value="0"  id="dep_percents_${method}_${
      provider.split(" ")[0]
    }">
    `;
    if (!(dep_eq_wit == "true"))
      checkbox.innerHTML += `<input type="range" min="0" max="100" value="0"  id="wit_percents_${method}_${
        provider.split(" ")[0]
      }">`;

    tr.appendChild(checkbox);

    checkbox.children[1].value =
      parseInt(
        localStorage.getItem(
          "slider_dep_" + `${method}_${provider.split(" ")[0]}`
        ),
        10
      ) || 0;
    if (!(dep_eq_wit == "true"))
      checkbox.children[2].value =
        parseInt(
          localStorage.getItem(
            "slider_wit_" + `${method}_${provider.split(" ")[0]}`
          ),
          10
        ) || 0;

    function recalc_dep() {
      //////////

      const foundlings = document.getElementsByClassName(
        method.toLowerCase() + "_active"
      );
      let output = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          output += parseInt(
            foundlings[index].parentNode.nextSibling.childNodes[1]
              .nextElementSibling.value,
            10
          );
        }
      }
      let total = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          const my_coef =
            foundlings[index].parentNode.nextSibling.childNodes[1]
              .nextElementSibling.value;

          const value_for_this = (isNaN(Math.round((my_coef * 100) / output / 5) * 5)) ? 0 : (Math.round((my_coef * 100) / output / 5) * 5);
          
          
          total += value_for_this;
          foundlings[
            index
          ].parentNode.nextSibling.nextSibling.childNodes[0].value = value_for_this;

          localStorage.setItem(
            "dep_" +
              foundlings[
                index
              ].parentNode.nextSibling.nextElementSibling.id.split(
                "cell_dep_"
              )[1],
            value_for_this
          );
        }
      }

      document.getElementById(method + "_dep_info").style.backgroundColor =
        total == 100 ? "white" : "red";

      if (!(dep_eq_wit == "true")) {
        document.getElementById(method + "_dep_info").innerHTML =
          "DEP SUM: " + total + "%";
        localStorage.setItem(method + "_dep_info", "DEP SUM: " + total + "%");
      } else {
        document.getElementById(method + "_dep_info").innerHTML = total + "%";
        localStorage.setItem(method + "_dep_info", total + "%");
      }
    }

    function recalc_wit() {
      if (dep_eq_wit == "true") return;

      //////////
      const foundlings = document.getElementsByClassName(
        method.toLowerCase() + "_active"
      );
      let output = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          output += parseInt(
            foundlings[index].parentNode.nextSibling.childNodes[4]
              .nextElementSibling.value,
            10
          );
        }
      }

      let total = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          const my_coef =
            foundlings[index].parentNode.nextSibling.childNodes[4]
              .nextElementSibling.value;
              const value_for_this = (isNaN(Math.round((my_coef * 100) / output / 5) * 5))? 0 : (Math.round((my_coef * 100) / output / 5) * 5)
          total += value_for_this;
          // output

          foundlings[
            index
          ].parentNode.nextSibling.nextSibling.nextSibling.childNodes[0].value = value_for_this;

          localStorage.setItem(
            "wit_" +
              foundlings[
                index
              ].parentNode.nextSibling.nextElementSibling.id.split(
                "cell_dep_"
              )[1],
            value_for_this
          );
        }
      }

      document.getElementById(method + "_wit_info").style.backgroundColor =
        total == 100 ? "white" : "red";
      document.getElementById(method + "_wit_info").innerHTML =
        "WIT SUM: " + total + "%";
      localStorage.setItem(method + "_wit_info", "WIT SUM: " + total + "%");
    }

    checkbox.children[1].addEventListener("input", function (params) {
      // params

      checkbox.children[1].value =
        Math.ceil(checkbox.children[1].value / 10) * 10;

      localStorage.setItem(
        "slider_dep_" + `${method}_${provider.split(" ")[0]}`,
        checkbox.children[1].value
      );

      ///////////////
      recalc_dep();
    });
    if (!(dep_eq_wit == "true"))
      checkbox.children[2].addEventListener("input", function (params) {
        checkbox.children[2].value =
          Math.ceil(checkbox.children[2].value / 10) * 10;

        localStorage.setItem(
          "slider_wit_" + `${method}_${provider.split(" ")[0]}`,
          checkbox.children[2].value
        );

        ///////////////
        recalc_wit();
      });
    //cell_dep_Bkash_abul

    document.getElementById(
      "is_enabled_" + method + "_" + provider.split(" ")[0]
    ).checked =
      localStorage.getItem(
        "is_enabled_" + method + "_" + provider.split(" ")[0]
      ) == "true";

    checkbox.children[0].addEventListener("click", function (event) {
      localStorage.setItem(
        "is_enabled_" + method + "_" + provider.split(" ")[0],
        JSON.stringify(
          document.getElementById(
            "is_enabled_" + method + "_" + provider.split(" ")[0]
          ).checked
        )
      );
      recalc_wit();
      recalc_dep();
    });
    //////
    const td_dep = document.createElement("td");
    td_dep.id = "cell_dep_" + method + "_" + provider.split(" ")[0];
    tr.appendChild(td_dep);

    const td_wit = document.createElement("td");
    td_wit.id = "cell_wit_" + method + "_" + provider.split(" ")[0];
    tr.appendChild(td_wit);
    if (dep_eq_wit == "true") my_hide(td_wit);
    /////////
    const td_banks = document.createElement("td");
    td_banks.className = "td_banks";
    td_banks.id = "banks_" + method + "_" + provider.split(" ")[0];
    // td_banks.style.width = '30%'

    // td_banks.style.width = '30%'
    // if(show_all_columns=='true')
    // td_banks.style.width = '10%'

    tr.appendChild(td_banks);

    const td_notes = document.createElement("td");
    td_notes.style.width = "20%";
    td_notes.id = "notes_" + method + "_" + provider.split(" ")[0];
    td_notes.innerHTML = `
    <textarea class='my_textarea' name="" id="area_${
      method + "_" + provider.split(" ")[0]
    }" cols="30" rows="2" placeholder="Введите тут заметку..."></textarea>
    `;
    // td_notes.style.width = '30%'
    tr.appendChild(td_notes);

    const textarea = document.getElementById(
      "area_" + method + "_" + provider.split(" ")[0]
    );
    textarea.value =
      localStorage.getItem("area_" + method + "_" + provider.split(" ")[0]) ||
      "";
    textarea.style.height = "";
    textarea.style.height = textarea.scrollHeight + 38 + "px";
    textarea.setAttribute(
      "oninput",
      'this.style.height = "";this.style.height = this.scrollHeight + "px"'
    );

    textarea.addEventListener("keyup", function (params) {
      localStorage.setItem(
        "area_" + method + "_" + provider.split(" ")[0],
        textarea.value
      );
    });

    const span2 = document.createElement("p");
    const pends = document.createElement("p");
    pends.className = "color_reset";
    pends.style.backgroundColor = "white";
    // pends.style.height='50px'
    const proc = document.createElement("p");
    
    proc.style.backgroundColor = "white";
    proc.style.borderRadius='5px'


    const dets = document.createElement("p");
    
    dets.style.backgroundColor = "white";
    dets.style.border= '1px solid #e0e0e0';
    dets.style.borderRadius='5px'

    span2.style.margin = "0";
    span2.className = "nav-sub-link__label";
    span2.style.fontSize = "12px";

    const providerId = provider.split("#")[1].slice(0, -1)
    span2.innerHTML ='<h2>'+
    providerId +
      " (" +
      provider.split("#")[0].slice(0, -2) +
      ")</h2>";
    //.substr(method.indexOf(" ") + 1);
    // span2.addEventListener('click',(event)=>{

    //   // alert(provider.split("#")[1].slice(0, -1))
    //   req_page(provider.split("#")[1].slice(0, -1))
    // })
    td_provider.appendChild(span2);
    td_provider.appendChild(pends);
    td_provider.appendChild(proc);
    td_provider.appendChild(dets);
    
    pendings(providerId, pends);
    
    //  processedCount(providerId, proc);
    
    
    const preloader = document.createElement('div')
   
    
    preloader.innerHTML= `
    

    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:transparent;display:block;" width="200px" height="173px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#dec17a" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#ffffff" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    </g>
    
    <g>
      <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
      <path fill="#dec17a" stroke="#000000" d="M97.2,49.3c0.1,6.3-1.1,12.6-3.4,18.4l-13.4-5.4c1.6-4,2.5-8.4,2.4-12.8"></path>
      <path fill="#ffffff" d="M93.6,49.3l-0.1,3.7l-0.4,3.7c-0.4,2.1-2.3,3.4-4.1,2.9l-0.2-0.1c-1.9-0.5-3-2.3-2.7-4l0.4-3.1l0.1-3.1"></path>
      <path fill="#dec17a" stroke="#000000" d="M85.5,62.3c-0.2,0.7-0.5,1.4-0.8,2.1l-0.9,2.1c-0.6,1.1-2,1.5-3.2,0.8c-1.1-0.7-1.7-2-1.1-2.9l0.8-1.8 c0.3-0.6,0.5-1.2,0.7-1.9"></path>
      <path fill="#dec17a" stroke="#000000" d="M94.6,65.5c-0.3,0.9-0.6,1.8-1,2.7l-1.1,2.6c-0.8,1.4-2.3,2-3.5,1.3v0c-1.1-0.7-1.5-2.2-0.9-3.4l1-2.4 c0.3-0.8,0.7-1.6,0.9-2.4"></path>
    </g>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
      <path fill="#dec17a" transform="translate(0,0.2)" stroke="#000000" d="M97.2,50.1c0-5-0.8-10-2.4-14.8c-0.4-1.2-1-2.2-1.8-3c-0.7-0.8-1.7-1.4-2.7-1.8c0,0.6-0.3,1.2-0.8,1.5 c-0.8,0.3-1.7,0-2.1-0.8l-0.5-1c-0.6,0.1-1.2,0.3-1.8,0.7c-0.6,0.3-1.1,0.7-1.6,1.2l0.4,0.9c0.4,0.7,0,1.6-0.8,2 c-0.6,0.3-1.2,0.2-1.6-0.1c-0.4,0.8-0.5,1.7-0.7,2.5c-0.1,0.9,0,1.7,0.3,2.5c1,3.3,1.6,6.8,1.6,10.2"></path>
      <path fill="#ffffff" transform="translate(0,0.3)" d="M86.4,50.1c0-1.3-0.1-2.6-0.2-3.8c-0.3-1.7,1-3.4,2.9-3.8l0.3,0c1.9-0.4,3.7,1,4,3.1c0.1,1.5,0.2,3.1,0.2,4.6"></path>
      <path fill="#ff9922" d="M93.1,34.1c0.1,0.4-0.3,0.8-0.9,1.1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1.1 C92.4,33.6,93,33.7,93.1,34.1z"></path>
      <path fill="#ff9922" d="M81.9,38.3c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,37.6,81.8,38,81.9,38.3z"></path>
      <path fill="#ff9922" stroke="#000000" d="M87.5,38.5l0.2,0.7c0.1,0.4,0.5,0.7,1,0.6c0.4-0.1,0.7-0.6,0.6-1L89,38"></path>
      <path d="M88.5,36.3c0.1,0.3-0.2,0.7-0.6,0.9c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.9C87.9,35.8,88.4,36,88.5,36.3z"></path>
      <path fill="none" stroke="#000000" d="M85.8,38c0.2,0.5,0.8,0.9,1.4,0.7c0.6-0.2,1.1-0.4,0.6-1.6c0.4,1.2,0.9,1.1,1.5,0.9c0.6-0.2,0.9-0.8,0.7-1.5"></path>
      <path fill="#dec17a" stroke="#000000" d="M86.8,42.1c0.2,0.7,0.2,1.5,0.4,2.2c0.1,0.8,0.3,1.5,0.3,2.3c0.1,1.3-0.9,2.3-2.3,2.3h0 c-1.3,0-2.5-0.8-2.5-1.9c0-0.7-0.2-1.3-0.3-2c-0.1-0.7-0.2-1.3-0.3-2"></path>
      <path fill="#dec17a" stroke="#000000" d="M96.1,40.1c0.2,0.9,0.3,1.9,0.5,2.8c0.1,0.9,0.3,1.9,0.4,2.8c0.1,1.6-0.9,2.9-2.2,2.9c-1.3,0-2.5-1.1-2.5-2.5 c0-0.9-0.2-1.7-0.3-2.5c-0.1-0.8-0.2-1.7-0.4-2.5"></path>
      <path fill="#000000" d="M90.9,33.7c0.2,0.6,0,1.3-0.6,1.5c-0.5,0.2-1.2-0.1-1.4-0.7c-0.2-0.6,0-1.2,0.6-1.5C90,32.7,90.6,33,90.9,33.7z"></path>
      <path fill="#000000" d="M85.3,35.9c0.2,0.5-0.1,1.1-0.6,1.3c-0.5,0.2-1.1,0-1.3-0.5c-0.2-0.5,0.1-1.1,0.6-1.3C84.5,35.1,85.1,35.4,85.3,35.9z"></path>
      <path fill="#8f722f" stroke="#000000" d="M83.2,34.9c0.8-0.3,1.1-1.2,0.8-2L83.5,32c-0.9,0.8-1.5,1.7-2,2.7C82,35.1,82.6,35.2,83.2,34.9z"></path>
      <path fill="#8f722f" stroke="#000000" d="M89.6,32c0.6-0.3,0.9-0.8,0.8-1.5c-1.1-0.4-2.3-0.5-3.4-0.3l0.5,1C87.8,32,88.8,32.3,89.6,32z"></path>
    </g>
    
    </svg>
    `   


td_provider.appendChild(preloader);
    const preloader2 = document.createElement('div')
   
    
    preloader2.innerHTML= `
    

    
    
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:transparent;display:block;" width="200px" height="103px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <g>
      <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
      <circle cx="50" cy="50" r="39.891" stroke="#6994b7" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
        <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
      </circle>
      <circle cx="50" cy="50" r="39.891" stroke="#eeeeee" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
        <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
      </circle>
      <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
        <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
      </circle>
      <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
        <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
      </circle>
    </g>
    
    <g>
      <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
      <path fill="#6994b7" stroke="#000000" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
      <path fill="#eeeeee" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
      <path fill="#6994b7" stroke="#000000" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
      <path fill="#6994b7" stroke="#000000" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
    </g>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
      <path fill="#eeeeee" stroke="#000000" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
      <path fill="#eeeeee" stroke="#000000" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
      <path fill="#6994b7" stroke="#000000" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
      <path fill="#eeeeee" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
      <path fill="#ff9922" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
      <path fill="#ff9922" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
      <path fill="#000000" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
      <path stroke="#000000" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
      <path fill="#6994b7" stroke="#000000" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
      <path fill="#6994b7" stroke="#000000" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
      <path fill="#000000" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
      <path fill="#000000" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>
    
    </g>
    </svg>
    
    `   


td_provider.appendChild(preloader2);

pdets(providerId,dets,preloader,preloader2)


    // setInterval(() => {
    //   pendings(provider.split("#")[1].slice(0, -1), pends);
      
    // }, 30000);

    const input_dep = document.createElement("input");
    input_dep.style.border = "1px solid";
    input_dep.style.borderRadius = "5px";
    input_dep.style.width = "3em";
    input_dep.style.padding = "2px";

    input_dep.addEventListener("input", (event) => {
      localStorage.setItem(
        "dep_" + method + "_" + provider.split(" ")[0],
        input_dep.value
      );

      const foundlings = document.getElementsByClassName(
        method.toLowerCase() + "_active"
      );
      let output = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          document.getElementById(
            "dep_percents_" + method + "_" + provider.split(" ")[0]
          ).value = parseInt(
            foundlings[index].parentNode.nextSibling.nextSibling.childNodes[0]
              .value,
            10
          );
          // document.getElementById('dep_percents_'+method+'_'+provider.split(" ")[0]).onchange()
          output += parseInt(
            foundlings[index].parentNode.nextSibling.nextSibling.childNodes[0]
              .value,
            10
          );
        }
      }

      document.getElementById(method + "_dep_info").style.backgroundColor =
        total == 100 ? "white" : "red";

      if (!(dep_eq_wit == "true")) {
        document.getElementById(method + "_dep_info").innerHTML =
          "DEP SUM: " + output + "%";
        localStorage.setItem(method + "_dep_info", "DEP SUM: " + output + "%");
      } else {
        document.getElementById(method + "_dep_info").innerHTML = output + "%";
        localStorage.setItem(method + "_dep_info", output + "%");
      }

      recalc_dep();
    });

    const input_wit = document.createElement("input");

    input_wit.addEventListener("input", (event) => {
      localStorage.setItem(
        "wit_" + method + "_" + provider.split(" ")[0],
        input_wit.value
      );

      const foundlings = document.getElementsByClassName(
        method.toLowerCase() + "_active"
      );
      let output = 0;
      for (let index = 0; index < foundlings.length; index++) {
        if (
          foundlings[index].parentNode.nextSibling.childNodes[0]
            .nextElementSibling.checked
        ) {
          document.getElementById(
            "wit_percents_" + method + "_" + provider.split(" ")[0]
          ).value = parseInt(
            foundlings[index].parentNode.nextSibling.nextSibling.nextSibling
              .childNodes[0].value,
            10
          );

          // document.getElementById('wit_percents_'+method+'_'+provider.split(" ")[0]).onchange()
          output += parseInt(
            foundlings[index].parentNode.nextSibling.nextSibling.nextSibling
              .childNodes[0].value,
            10
          );
        }
      }

      document.getElementById(method + "_wit_info").style.backgroundColor =
        output == 100 ? "white" : "red";
      document.getElementById(method + "_wit_info").innerHTML =
        "WIT SUM: " + output + "%";
      localStorage.setItem(method + "_wit_info", "WIT SUM: " + output + "%");

      recalc_wit();
    });

    input_wit.style.border = "1px solid";
    input_wit.style.borderRadius = "5px";
    input_wit.style.padding = "2px";

    input_wit.style.width = "3em";
    input_dep.value =
      localStorage.getItem("dep_" + method + "_" + provider.split(" ")[0]) || 0;
    input_wit.value =
      localStorage.getItem("wit_" + method + "_" + provider.split(" ")[0]) || 0;

    td_dep.appendChild(input_dep);

    td_wit.appendChild(input_wit);

    if (show_all_columns != "true") {
      my_hide(td_dep);
      my_hide(td_wit);
      my_hide(checkbox);
    }

    req(
      provider.split("#")[1].slice(0, -1),
      td_banks,
      span2,
      provider.split(" ")[0]
    );
  }

  setTimeout(() => {
    create_base();
    create_structure();



  }, 1000);
})();

function req(id, node, provider_node, method_name) {
  if (!make_req) return;
  async function postData(subagent_id = "") {
    // Default options are marked with *
    const response = await fetch("", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: "https://managment.io/admin/banktransfer",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"subagent_id":' + subagent_id + ',"ref_id":null}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  return postData(id).then((data) => {
    const banks = data.banks.map((bank) => {
      return [bank.name, bank.in_use, bank.id, bank.list_bank_details];
    });

    const any_in_use = banks.filter((bank) => bank[1] == 1);
    if (banks.length) {
      let names = "";
      for (let index = 0; index < banks.length; index++) {
        const highlight = document.createElement("div");
        highlight.textContent = banks[index][0] + "-" + banks[index][2];
        highlight.style.width = "100%";

        if (banks[index][1] == 1) {
          highlight.style.borderLeft = "5px solid #abffc1";
          highlight.style.borderTop = "5px solid #abffc1";
          highlight.style.borderRight = "5px solid #abffc1";

          highlight.style.color = "#d17f04";
        }
        node.appendChild(highlight);

        names += JSON.stringify(banks[index][3]) + ", ";

        const bank_p = document.createElement("p");
        if (banks[index][1] == 1) {
          // bank_p.style.backgroundColor = '#abffc1';
          bank_p.style.borderLeft = "5px solid #abffc1";
          bank_p.style.borderRight = "5px solid #abffc1";
          bank_p.style.borderBottom = "5px solid #abffc1";
          // bank_p.style.borderRadius = '5px'

          bank_p.title = "Bank " + banks[index][0] + " active";
        }
        bank_p.style.padding = "5px";
        bank_p.style.marginTop = "0px";

        bank_p.innerHTML = names.slice(0, -2);

        document.getElementById(
          "checkbox_" + method_name.toLowerCase()
        ).style.color = "#d17f04";

        provider_node.style.color = "#d17f04";
        provider_node.style.fontSize = "15px";
        provider_node.classList.add(
          node.id.split("_")[1].toLowerCase() + "_active"
        );

        node.appendChild(bank_p);
      }
      return true;
    } else {
      return false;
    }
  });
}

function pendings(provider_id, node) {
  if (!make_req) return 
  async function pen_dep_f(id) {
    // console.log("%c 🛴: functionpen_dep_f -> id ", "font-size:16px;background-color:#d0680b;color:white;", id)

    const response = await fetch(
      "https://managment.io/admin/report/pendingrequestrefill",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://managment.io/admin/report/pendingrequestrefill",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          '{"date_from":"' +
          week_ago +
          ' 00:00","date_to":"' +
          my_today +
          ' 23:59","subagent_id":' +
          id +
          ',"bank_id":null,"ref_id":null,"ref_ids":[]}',
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return response.json();
  }
  //
  return pen_dep_f(provider_id).then((data) => {
    // console.log(
    //   "%c 🚗: functionpen_wit -> data ",
    //   "font-size:16px;background-color:#55d4cf;color:black;",
    //   data.data
    // );
    node.innerHTML = "<h1>Pending</h1> <br> <b>deps: </b>" + data.data.length;

    node.className='color_timer'

    // console.log(provider_id+ ' color_timer: '+node.classList.contains('color_timer')+' color_reset: '+node.classList.contains('color_reset'))
setTimeout(() => {
  node.className='color_reset'
  
}, 15000);

 
    node.title = "from " + week_ago + " to" + my_today;
    pen_wit(provider_id, node);
  });
}

function processedCount(provider_id, node) {
  if (!make_req) return 
  async function approved_withs(id) {
 
    const response = await fetch("https://managment.io/admin/report/requestwithdrawal", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://managment.io/admin/report/requestwithdrawal",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"date_from\":\"" +
                  week_ago +
                  " 00:00\",\"date_to\":\"" +
                  my_today +
                  " 23:59\",\"status\":2,\"subagent_id\":" +
                  id +
                  ",\"bank_id\":null,\"ref_id\":null,\"id\":null,\"ref_ids\":[],\"request_key\":"+Date.now()+"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    return response.json();
  }
  async function processed_deps(id) {
 
    const response = await fetch("https://managment.io/admin/report/requestrefill", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://managment.io/admin/report/requestrefill",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"date_from\":\"" +
              week_ago +
              " 00:00\",\"date_to\":\"" +
              my_today +
              " 23:59\",\"status\":3,\"subagent_id\":" +
              id +
              ",\"bank_id\":null,\"ref_id\":null,\"id\":null,\"ref_ids\":[],\"request_key\":"+Date.now()+"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    return response.json();
  }


  return processed_deps(provider_id).then((data) => {
    // console.log("%c 🚬: processed -> data ", "font-size:16px;background-color:#e5b519;color:white;", JSON.parse( data.data).Value.Data)

     node.innerHTML = "Completed requests: <br>deps: " + JSON.parse( data.data).Value.Data.length;

    // node.className='color_timer'

 
 
    node.title = "from " + week_ago + " to" + my_today;

    approved_withs(provider_id).then((data)=>{

      node.innerHTML += "<br>withs: " + JSON.parse( data.data).Value.Data.length;

    })
  });
}

function pen_wit(provider_id, node) {
  if (!make_req) return 
  async function pen_wit_f(id) {
    // console.log("%c 🛴: functionpen_dep_f -> id ", "font-size:16px;background-color:#d0680b;color:white;", id)

    const response = await fetch(
      "https://managment.io/admin/report/pendingrequestwithdrawal",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json;charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://managment.io/admin/report/pendingrequestwithdrawal",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          '{"date_from":"' +
          week_ago +
          ' 00:00","date_to":"' +
          my_today +
          ' 23:59","subagent_id":' +
          id +
          ',"bank_id":null,"ref_id":null,"ref_ids":[]}',
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return response.json();
  }

  return pen_wit_f(provider_id).then((data) => {
    //white

    node.className='color_timer'

    // console.log(provider_id+ ' color_timer: '+node.classList.contains('color_timer')+' color_reset: '+node.classList.contains('color_reset'))

    node.className='color_reset'

    // console.log(provider_id+ ' color_timer: '+node.classList.contains('color_timer')+' color_reset: '+node.classList.contains('color_reset'))

    setTimeout(() => {

      node.className='color_timer'

      // console.log(provider_id+ ' timer: '+node.classList.contains('color_timer')+' reset: '+node.classList.contains('color_reset'))

      node.className='color_reset'

      // node.classList.toggle("color_reset");

      // console.log(provider_id+ ' timer: '+node.classList.contains('color_timer')+' reset: '+node.classList.contains('color_reset'))

    }, 30000);
    
    node.innerHTML += "<br><b>withs:</b> " + data.data.length;

    node.title = "from " + week_ago + " to" + my_today;
    document.querySelector("#app > div > div.wrap-white.block > div:nth-child(1)").textContent="Полностью загрузилось за: "+ (Date.now()-timerStart)/1000+" секунд"

  });
}

function pdets(to_check_provider_id,node,nodeToHide,nodeToHide2)
{ if(!make_req) return
  async function approved_withs(id) {
     
    const response = await fetch("https://managment.io/admin/report/requestwithdrawal", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://managment.io/admin/report/requestwithdrawal",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"date_from\":\"" +
                  week_ago +
                  " 00:00\",\"date_to\":\"" +
                  my_today +
                  " 23:59\",\"status\":2,\"subagent_id\":" +
                  id +
                  ",\"bank_id\":null,\"ref_id\":null,\"id\":null,\"ref_ids\":[],\"request_key\":"+Date.now()+"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    return response.json();
  }

async function processedDetails(id) {

  const response = await fetch("https://managment.io/admin/report/requestrefill", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://managment.io/admin/report/requestrefill",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"date_from\":\""+prev_day+" 00:00\",\"date_to\":\""+my_today+" 23:59\",\"status\":3,\"subagent_id\":"+id+",\"bank_id\":null,\"ref_id\":null,\"id\":\"\",\"ref_ids\":[],\"request_key\":"+Date.now()+"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

  
  return response.json();
}


return processedDetails(to_check_provider_id,node).then((data) => {

  const trans_arr = JSON.parse( data.data).Value.Data

  const colums = JSON.parse( data.data).Value.Columns

  const dateFromInd = colums.findIndex(el=>el=='dt')
  const dateToInd = colums.findIndex(el=>el=='dtedit')

  const SummaInd = colums.findIndex(el=>el=='Summa')
  const currencyInd = colums.findIndex(el=>el=="currency")

  let summa = 0;
  let currency ;
  let seconds = 0n;
  // console.log("%c 🙈: functioncreate_structure -> colums ", "font-size:16px;background-color:#7bf123;color:black;", colums)
  
  for (let index = 0; index < trans_arr.length; index++) {
    const element = trans_arr[index];
    // console.log("%c 🐐: functioncreate_structure -> element ", "font-size:16px;background-color:#aaffde;color:black;", element)
    summa+= parseFloat(element[SummaInd])
    currency = element[currencyInd]
const second = BigInt((parseInt(element[dateToInd].replace('/Date(','').replace(')/','').split('+')[0],10) - parseInt(element[dateFromInd].replace('/Date(','').replace(')/','').split('+')[0],10))/1000)
// console.log("%c ⚖️: functioncreate_structure -> second ", "font-size:16px;background-color:#6cbc9c;color:white;", (parseInt(element[dateToInd].replace('/Date(','').replace(')/','').split('+')[0],10) - parseInt(element[dateFromInd].replace('/Date(','').replace(')/','').split('+')[0],10))/1000)
    seconds += second;

  }

  // console.log("%c 🏬:Summa ", "font-size:16px;background-color:#63fb63;color:black;", summa+' '+currency)
  // console.log("%c 🏬: count ", "font-size:16px;background-color:#63fb63;color:black;", trans_arr.length)
  // console.log("%c 🏬: time ", "font-size:16px;background-color:#63fb63;color:black;", Number(seconds))
  // console.log("%c 🏬:avg time ", "font-size:16px;background-color:#63fb63;color:black;",  Number(seconds)/trans_arr.length )

  node.title='Range: '+prev_day + ' '+my_today

  node.innerHTML=`<h1>Completed</h1><br/><h2>Deps</h2><br/>
  <b>Total amount</b>: ${amountPrepare(trans_arr.length)}
  <br/>
  <b>Summa</b>: ${  (trans_arr.length>0) ? amountPrepare(summa)+' '+currency : '-'} 
  <br/>

  <b>Avg. proc. time</b>: ${(trans_arr.length>0) ? new Date( Number(seconds)/trans_arr.length * 1000).toISOString().substr(11, 8) : '-'}
  `
  nodeToHide.remove()
  approved_withs(to_check_provider_id,node).then((data) => {

    const trans_arr = JSON.parse( data.data).Value.Data
  
    const colums = JSON.parse( data.data).Value.Columns
  
    const dateFromInd = colums.findIndex(el=>el=='date_payment')
    const dateToInd = colums.findIndex(el=>el=='date_edit')
  
    const SummaInd = colums.findIndex(el=>el=='summa')
    const currencyInd = colums.findIndex(el=>el=="currency")
  
    let summa = 0;
    let currency ;
    let seconds = 0n;
    // console.log("%c 🙈: approved_withs ", "font-size:16px;background-color:#7bf123;color:black;", colums)
    
    for (let index = 0; index < trans_arr.length; index++) {
      const element = trans_arr[index];
      // console.log("%c 🐐: functioncreate_structure -> element ", "font-size:16px;background-color:#aaffde;color:black;", element)
      summa+= parseFloat(element[SummaInd])
      currency = element[currencyInd]
  const second = BigInt((parseInt(element[dateFromInd].replace('/Date(','').replace(')/','').split('+')[0],10) - parseInt(element[dateToInd].replace('/Date(','').replace(')/','').split('+')[0],10))/1000)
  // console.log("%c ⚖️: functioncreate_structure -> second ", "font-size:16px;background-color:#6cbc9c;color:white;", (parseInt(element[dateToInd].replace('/Date(','').replace(')/','').split('+')[0],10) - parseInt(element[dateFromInd].replace('/Date(','').replace(')/','').split('+')[0],10))/1000)
      seconds += second;
  
    }
  
    // console.log("%c 🏬:Summa ", "font-size:16px;background-color:#63fb63;color:black;", summa+' '+currency)
    // console.log("%c 🏬: count ", "font-size:16px;background-color:#63fb63;color:black;", trans_arr.length)
    // console.log("%c 🏬: time ", "font-size:16px;background-color:#63fb63;color:black;", Number(seconds))
    // console.log("%c 🏬:avg time ", "font-size:16px;background-color:#63fb63;color:black;",  Number(seconds)/trans_arr.length )
  
    node.title='Range: '+prev_day + ' - '+my_today
    
    node.innerHTML+=`<h2>Withs</h2><br/>
    <b>Total amount</b>: ${amountPrepare(trans_arr.length)}
    <br/>
    <b>Summa</b>: ${  (trans_arr.length>0) ? amountPrepare(summa)+' '+currency : '-'} 
    <br/>
   
    <b>Avg. proc. time</b>: ${(trans_arr.length>0) ? new Date( Number(seconds)/trans_arr.length * 1000).toISOString().substr(11, 8) : '-'}
    `

    document.querySelector("#app > div > div.wrap-white.block > div:nth-child(1)").textContent="Полностью загрузилось за: "+ (Date.now()-timerStart)/1000+" секунд"
    nodeToHide2.remove()
  });

});
}


