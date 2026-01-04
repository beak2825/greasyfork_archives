// ==UserScript==
// @name         Deposit Support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Deposit Support123
// @author       Dimas
// @match        https://managment.io/admin/report/requestrefill
// @match        https://managment.io/en/admin/report/requestrefill
// @require https://greasyfork.org/scripts/422672-vanilla-js-tooltip-min-js/code/vanilla-js-tooltipminjs.js?version=907038
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424448/Deposit%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/424448/Deposit%20Support.meta.js
// ==/UserScript==



(function () {
  let global_ref_id = " "; // :( duplicate. in refactor count for this
  let global_order = " "; // :( duplicate. in refactor count for this
  let global_subagent = " "; // :( duplicate. in refactor count for this
  let global_bank = " "; // :( duplicate. in refactor count for this
  let li_focus_index = 0;
  let global_player = " ";
  
  let mysnack = document.createElement("div");
  const make_search = true;
  mysnack.id = "snackbar";
  // mysnack.appendChild(mysnack_title)
  document.body.appendChild(mysnack);

  var amount_div = document.createElement("div");
  var amount_input = document.createElement("input");
  var amount_make = document.createElement("button");
  var amount_close = document.createElement("button");
  const amount_i = document.createElement("i");
  const amount_i2 = document.createElement("i");

  amount_i2.className = " fa fa-file-alt";
  amount_i2.id = "amount_trx";
  amount_i.className = "fa fa-times";
  amount_close.className = "btn btn-danger modal_close";
  amount_close.id = "amount_close";

  amount_make.className = "btn btn-success";
  amount_make.textContent = "Подтвердить";
  amount_make.id = "amount_make";
  amount_div.textContent = "Введите сумму для транзакции";
  amount_input.id = "amount_input";
  amount_div.id = "amount_div";

  amount_close.appendChild(amount_i);
  amount_div.appendChild(amount_i2);
  amount_div.appendChild(amount_input);
  amount_div.appendChild(amount_make);
  amount_div.appendChild(amount_close);

  document.body.appendChild(amount_div);

 
  
  let change_div = document.createElement("div");
  change_div.id = "change_div";
  

 
  change_div.innerHTML = `CHANGE SUBAGENT
  <button id='close_change' class="btn btn-danger modal_close"><i class="fa fa-times"></i></button>
<div id='change_order'><i class="fa fa-file-alt"></i> заказ</div>

<div class="input-group my-input-group ">
<span>Ref link</span>
  <div class="multiselect my-multiselect">
    <div class="multiselect__select"></div>  
    <div class="multiselect__tags">
      <input name="" type="text" autocomplete="off" placeholder="select Ref link" tabindex="0" value='melbet' class="multiselect__input">
    </div> 
      <div class="multiselect__content-wrapper"  style="max-height: 300px; display: none;">
        <ul class="multiselect__content" id="change_reflink" style="display: inline-block;">
   
        </ul>
      </div> 
    </div>
  </div>
</div>

<div class="input-group my-input-group " id="change_subagent_group">
<span>Sub Agent</span>
  <div class="multiselect my-multiselect">
    <div class="multiselect__select"></div>  
    <div class="multiselect__tags">
      <input   id="change_subagent_input" name="" type="text" autocomplete="off" placeholder="select Sub Agent" tabindex="0" class="multiselect__input">
    </div> 
      <div class="multiselect__content-wrapper hidden_el" id="change_subagent_multi" style="max-height: 300px; display:none;">
        <ul class="multiselect__content" id="change_subagent" style="display: inline-block;">
           
        </ul>
      </div> 
    </div>

  </div>

</div>

<div class="input-group my-input-group ">
<span>Bank</span>
  <div class="multiselect my-multiselect">
    <div class="multiselect__select"></div>  
    <div class="multiselect__tags">
      <input id="change_bank_input" name="" type="text" autocomplete="off" placeholder="select Bank" tabindex="0" class="multiselect__input">
    </div> 
      <div class="multiselect__content-wrapper" id="change_bank_multi" style="max-height: 300px; display: none;">
        <ul class="multiselect__content" id="change_bank" style="display: inline-block;">
           
        </ul>
      </div> 
    </div>

  </div>

</div>


<button id='change_sub_button' class="btn btn-success">Подтвердить </button>
`;
 
  document.body.appendChild(change_div);

function apply_subagent_change(params) {
  
  console.log('!order '+global_order+' subagent '+global_subagent + ' bank '+global_bank)


    
  // Example POST method implementation:

  async function make_change_sub() {
    // Default options are marked with *
    const response = await fetch("https://managment.io/admin/changesubagent/editsubagenttoorder", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://managment.io/admin/report/recountingwebreplenishment",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"id\":\""+global_order+"\",\"subagent_id\":"+global_subagent+",\"bank_id\":"+global_bank+",\"ref_id\":"+global_ref_id+"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  make_change_sub().then((data) => {
    
      console.log(data);

      showSnack(
        JSON.stringify(
          data
        ),
        "green",
        global_order,
        global_player,
         ''
      );

    if(data.success){
      document.getElementById('change_div').style.display='none'
      delete_els_by_class_name('change_bank')
      delete_els_by_class_name('change_subagent')
    }
  });
}

  document.getElementById('change_sub_button').addEventListener('click',function (params) {
    apply_subagent_change()
  })
  document.getElementById('change_sub_button').addEventListener('keyup',function (event) {
    if (event.key=='Enter') {
      apply_subagent_change()
    }
    
  })

  const that_input = document.getElementById('change_subagent_input')

  that_input.addEventListener('click',function (params) {
    document.getElementById('change_subagent_multi').style.display='block'
    document.getElementById('change_bank_multi').style.display='none'

  })
  that_input.addEventListener('keyup',function (event) {


    // console.log("%c 🦓: event.key ", "font-size:16px;background-color:#6aacf9;color:white;", event)
    if(event.key=='ArrowDown'){
const li_childs = document.getElementById('change_subagent').children;
// li_childs[li_childs.length].focus()
      // document.getElementById('change_subagent').childNodes[0].focus()
      for (let index = 0; index < li_childs.length; index++) {
        const element = li_childs[index];
        if(element.style.display != 'none')
        {
            element.focus()
return;
        }
      }

}
    if(event.key=='ArrowUp'){
      const li_childs = document.getElementById('change_subagent').children;
      // li_childs[li_childs.length].focus()
            // document.getElementById('change_subagent').childNodes[0].focus()
            for (let index = li_childs.length-1; index > 0; index--) {
              const element = li_childs[index];
              if(element.style.display != 'none')
              {
                  element.focus()
      return;
              }
            }
      
      }

    // document.getElementById('change_subagent_multi').style.display='block'
    // document.getElementById('change_bank_multi').style.display='none'

  })
  
//search
  that_input.addEventListener('keyup',function (params) {
    

const input_text = document.getElementById('change_subagent_input').value

const sub_lis = document.getElementById('change_subagent').children


for (let index = 0; index < sub_lis.length; index++) {
  const element = sub_lis[index];
  // console.log("%c ⏺️: element ", "font-size:16px;background-color:#283a85;color:white;", element)
  element.style.display =  (element.textContent.toLowerCase().indexOf( input_text.toLowerCase()) ==-1)  ? 'none' : 'block'

}

  })


  const this_input = document.getElementById('change_bank_input')

  this_input.addEventListener('click',function (params) {
    document.getElementById('change_bank_multi').style.display='block'

    document.getElementById('change_subagent_multi').style.display='none'

  })

  this_input.addEventListener('keyup',function (event) {
    

const input_text = document.getElementById('change_bank_input').value

const sub_lis = document.getElementById('change_bank').children


for (let index = 0; index < sub_lis.length; index++) {
  const element = sub_lis[index];
  
  element.style.display =  (element.textContent.toLowerCase().indexOf( input_text.toLowerCase()) ==-1)  ? 'none' : 'block'

}

if(event.key=='ArrowDown'){
  const li_childs = document.getElementById('change_bank').children;
  // li_childs[li_childs.length].focus()
        // document.getElementById('change_subagent').childNodes[0].focus()
        for (let index = 0; index < li_childs.length; index++) {
          const element = li_childs[index];
          if(element.style.display != 'none')
          {
              element.focus()
  return;
          }
        }
  
  }
      if(event.key=='ArrowUp'){
        const li_childs = document.getElementById('change_bank').children;
        // li_childs[li_childs.length].focus()
              // document.getElementById('change_subagent').childNodes[0].focus()
              for (let index = li_childs.length-1; index > 0; index--) {
                const element = li_childs[index];
                if(element.style.display != 'none')
                {
                    element.focus()
        return;
                }
              }
        
        }

  })

  document.getElementById('close_change').addEventListener('click', function (params) {

    delete_els_by_class_name('recurring_bank')
    delete_els_by_class_name('recurring_subagent')

    document.getElementById('change_div').style.display='none'
    document.getElementById('change_subagent_input').value=''
    document.getElementById('change_bank_input').value=''

  })
 

  function amount_change()
  {

    const transaction = document.getElementById("amount_trx").textContent;

    
    console.log(document.getElementById("amount_input").value);
    console.log(global_ref_id);

    async function postData(order, refID, stat, amount) {
      // Default options are marked with *
      const response = await fetch(
        "https://managment.io/admin/report/recountingwebreplenishment",
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
          referrer:
            "https://managment.io/admin/report/recountingwebreplenishment",
          referrerPolicy: "strict-origin-when-cross-origin",
          body:
            '{"status":10,"summa":' +
            amount +
            ',"new_number":null,"order_ids":"' +
            order +
            '","comment":"","ref_id":' +
            refID +
            ',"field_id":null,"field":""}',
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData(
      transaction,
      global_ref_id,
      " ",
      document.getElementById("amount_input").value
    ).then(
      (data) => {
        console.log(data);

        showSnack(
          JSON.stringify(data.data.total[0]),
          JSON.stringify(data.data.total[0]).indexOf(
            "Сумма успешно изменена"
          ) == -1
            ? "red"
            : "green",
          transaction,
          global_player,
          10
        );

        if(data.data.total[0].stat!=' Ошибка!')
    document.getElementById("amount_div").style.display = "none";

      }
      
    );
    postData(
      transaction,
      global_ref_id,
      " ",
      document.getElementById("amount_input").value
    );

  }
  amount_make.addEventListener("click", function (params) {
    amount_change()

  });
  amount_input.addEventListener('keyup',function (event) {
    
   if(event.key=='Enter')
   amount_change()
   if(event.key=='Escape')
   document.getElementById("amount_div").style.display = "none";

  })

  amount_close.addEventListener("click", function (params) {
    document.getElementById("amount_div").style.display = "none";
  });

  function shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  }

  function showSnack(text, color = "black", id, playerid, status) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    x.onclick = function () {
      x.className = x.className.replace("show", "");
      if (status == 3)
        navigator.clipboard.writeText(id + " " + playerid + " Approved");
      if (status == 2)
        navigator.clipboard.writeText(
          id + " " + playerid + " payment cancelled"
        );
        if (status == 10)
        navigator.clipboard.writeText(
          id + " " + playerid + " amount changed"
        );
    };

    x.textContent = text;
    x.style.backgroundColor = color;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 10000);
  }

  String.prototype.fuzzy = function (term, ratio) {
    var string = this.toLowerCase();
    var compare = term.toLowerCase();
    var matches = 0;
    if (string.indexOf(compare) > -1) return true; // covers basic partial matches
    for (var i = 0; i < compare.length; i++) {
      string.indexOf(compare[i]) > -1 ? (matches += 1) : (matches -= 1);
    }
    return matches / this.length >= ratio || term == "";
  };

  ("use strict");

  var css = `

  li:focus {
    background-color: green;
    color: white;
  }

  .multiselect__option:hover{
    background-color: green;
    color: white;
  }
  button i:before {
    width: 100%;
    height: 100%;
    font-size: 20px;
  }
  .my-multiselect{
    width: 70%;
  }
.my-input-group{
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
#change_div {
    padding: 15px;
    font-size: 15px;
    margin: auto;
    position: absolute;
   top: 0; left: 0; bottom: 0; right: 0;
  
    width: 350px;
     height: 450px;
    z-index: 101;
    background-color: #fff;

    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;



    border: 10px solid;
    background-color: #fff;
    border-image-slice: 1;
    border-width: 3px;
    border-image-source: linear-gradient(90deg,#259dab,#2574ab);

    -webkit-box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);
-moz-box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);
box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);

  }
 
  

  td button{
    width: 30px !important;
    height: 30px !important;
    display: flex !important;
    justify-content: center;
    align-items: center;
// padding: 2px !important;
  }
  #amount_trx{
    padding: 10px;
    font-weight: 900;
    font-size: 27px;
  }
  #amount_trx.fa-file-alt:before{
    margin-right: 10px;
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
  .modal_close:hover{
    background-color: #94332f;
  }
  #amount_input{
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    margin: 15px;
    background-color: #d8dce3;
    width: 100%;
  }
 
  #amount_div {
    padding: 15px;
    font-size: 15px;
    margin: auto;
    position: absolute;
   top: 0; left: 0; bottom: 0; right: 0;
  
    width: 350px;
     height: 200px;
    z-index: 100;
    background-color: #fff;

    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;



    border: 10px solid;
    background-color: #fff;
    border-image-slice: 1;
    border-width: 3px;
    border-image-source: linear-gradient(90deg,#259dab,#2574ab);

    -webkit-box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);
-moz-box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);
box-shadow: 4px 4px 20px 15px rgba(34, 60, 80, 0.14);

  }
 

  .b-tooltip{
    -webkit-box-shadow: 0px 10px 13px -7px #000000, -5px -5px 15px -5px rgba(0,0,0,0); 
    box-shadow: 0px 10px 13px -7px #000000, -5px -5px 15px -5px rgba(0,0,0,0); 
    border-radius: 5px;font-size: 17px !important;
    // border:1px solid #fff;
    display:inline-block;
    font-size:.875em;padding:.75em;position:absolute;text-align:center; z-index: 1000;}
  .b-tooltip-light{
    background:#eaeaea;
    background:linear-gradient(to bottom, #fdfdfd 0%, #eaeaea 100%);
    box-shadow:0px 0px 6px 2px rgba(110,110,110,0.4);color:#242424}
  .b-tooltip-dark{background:#242424;background:linear-gradient(to bottom, #6e6e6e 0%, #242424 100%);box-shadow:0px 0px 6px 2px #6e6e6e;color:#fff}
  .b-tooltip-blue{
    border-radius: 5px;

    border: 10px solid;
    background-color: #fff;
    border-image-slice: 1;
    border-width: 3px;
    border-image-source: linear-gradient(90deg,#259dab,#2574ab);

    // background-image: linear-gradient(90deg,#259dab,#2574ab);

    // color:#fff
  }
  // body{font-family:sans-serif;height:2000px}
  // img{display:block}
  .wrap{margin:0 auto;width:800px}
  // span{background:#ffe4e1;border:2px dotted #c00;cursor:default;display:inline-block;padding:5px}
.btn{
  margin: 2px;
}
  .btn_container{
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    height: 100% !important;
    padding: 5px !important;
  }
  .btn_container * {
    width: initial;

    
  }
  /* The snackbar - position it at the bottom and in the middle of the screen */
  button i {
    pointer-events: none;
  }
  #snackbar {
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    margin-left: -125px; /* Divide value of min-width by 2 */
    background-color: #333; /* Black background color */
    color: #fff; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 1; /* Add a z-index if needed */
    left: 50%; /* Center the snackbar */
    bottom: 30px; /* 30px from the bottom */
    font-size: 14px;
    // background-image: linear-gradient( 90deg ,#259dab,#2574ab);
    cursor: pointer;
  }
  
  /* Show the snackbar when clicking on a button (class added with JavaScript) */
  #snackbar.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 9.5s;
    animation: fadein 0.5s, fadeout 0.5s 9.5s;
  }
  
  /* Animations to fade the snackbar in and out */
  @-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }
  
  @keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }
  
  @-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }
  
  @keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }


  .highlighted_fuz{
    //background-color: #feabff ;
  }
  .highlighted_2{
    background-color:#fffeab ;
  }



  .highlighted{
    background-color:#abcdff ;
  }
  .highlighted_trxid2{
    border-left: 20px solid #abcdff;

  }
  .highlighted_trxid{
    background-color:#abffab ;
  }
  .highlighted_tr{
    border-left: 20px solid #abffab;
  }
.hidden_el{
  display: none;
}

#change_sub_button:focus {
  background-color: #72d1db !important;
  border: 1px solid gray;
}

  `;
  //TODO STYLES

  var style = document.createElement("style");

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName("head")[0].appendChild(style);

  let prev_table = 0;
  let this_table = document.createElement("div");

  // document.querySelector("#filter_form > div > div:nth-child(9) > button")

  var prev_clipboard_text = "";
  var clipboard_text = "";
  const quick_search_button = document.createElement('button')
  function set_fields({trans='',userid='',info=''}){


    document.querySelector("#filter_form > div > div:nth-child(2) > input[type=text]").setAttribute('value',trans);
    document.querySelector("#filter_form > div > div:nth-child(2) > input[type=text]").dispatchEvent(new Event('input'))
    
    // $("#filter_form > div > div:nth-child(2) > input[type=text]").val(id);
    // document.querySelector("#filter_form > div > div:nth-child(3) > input[type=text]").click() 
    document.querySelector("#filter_form > div > div:nth-child(3) > input[type=text]").setAttribute('value',userid);
    document.querySelector("#filter_form > div > div:nth-child(3) > input[type=text]").dispatchEvent(new Event('input'))

    // document.querySelector("#filter_form > div > div:nth-child(4) > input[type=text]").click()
    document.querySelector("#filter_form > div > div:nth-child(4) > input[type=text]").setAttribute('value',info);
    document.querySelector("#filter_form > div > div:nth-child(4) > input[type=text]").dispatchEvent(new Event('input'))

  }



  quick_search_button.addEventListener('click',function(){
  const tocheck =   this.textContent.trim()
    // console.log("%c 🥕: this.textContent ", "font-size:16px;background-color:#6a29fe;color:white;", this.textContent)
if(tocheck.startsWith('3')||tocheck.startsWith('2')){    
  if(tocheck.startsWith('3')) 
  {
    set_fields({trans:tocheck})
  }

  if(tocheck.startsWith('2')) 
  {
    set_fields({userid:tocheck})
  }}
  else{
    if(tocheck.length<=15) 
    {
      set_fields({info:tocheck})
    }
  }


  setTimeout(() => {
    document.querySelector("#filter_form > div > div:nth-child(9) > button").click();
        }, 100);

  })


  quick_search_button.className = 'btn btn-success btn-settings-columns'
  quick_search_button.innerHTML=`
      <i class='fa fa-search'></i>
  `
// let search_button ;
  function clip_changed() {
    if (!make_search) return;


    const tds = document.getElementsByTagName("td");


    clipboard_text = clipboard_text.replace(/[^0-9A-zА-я]+/gm, ` `);

    const clip_tokens = clipboard_text.split(" ").filter((el) => el.length > 2);
  
    for (let index = 0; index < tds.length; index++) {
      const element = tds[index];
      if (!element.classList.contains("recurring_element")) {
        element.classList.remove("highlighted");
        element.classList.remove("highlighted_2");
        element.classList.remove("highlighted_fuz");
        element.classList.remove("highlighted_trxid");
        
        element.parentElement.classList.remove('highlighted_tr')
        element.parentElement.classList.remove('highlighted_trxid2')

        // var t = ;

        // element.innerHTML = element.textContent || element.innerText;

        for (
          let token_index = 0;
          token_index < clip_tokens.length;
          token_index++
        ) {
          const check = element.innerHTML;
          const token_element = clip_tokens[token_index];

          if (element.innerHTML.indexOf(token_element) != -1) {
            element.classList.add("highlighted");
            element.parentElement.classList.add('highlighted_trxid2')

             
            
            
          } else {
            if (
              element.innerHTML
                .toLowerCase()
                .indexOf(token_element.toLowerCase()) != -1
            ) {
              // console.log(
              //   "%c 🍑: highlighted ",
              //   "font-size:16px;background-color:#233703;color:white;",
              //   token_element.toLowerCase() +
              //     " in " +
              //     element.innerHTML.toLowerCase()
              // );
              element.classList.add("highlighted_2");
            }

            if (element.textContent.trim().fuzzy(token_element, 0.8)) {
              //  console.log('fuzzy')

              element.classList.add("highlighted_fuz");
            }
          }
          if (element.textContent.indexOf('ext_trn_id: '+token_element) != -1
          ||
          element.textContent.indexOf('"ext_trn_id": "'+token_element) != -1
          ||
          element.textContent.indexOf('18 Digit Order ID: '+token_element) != -1
          ||
          element.textContent.indexOf('"18 Digit Order ID": "'+token_element) != -1
          
          )
          {
            element.parentElement.classList.add('highlighted_tr')
            console.log(" ", "font-size:16px;background-color:#caf82b;color:black;", element.parentElement)
            
            element.classList.remove("highlighted");
            element.classList.remove("highlighted_2");
            element.classList.remove("highlighted_fuz");
            
            element.classList.add("highlighted_trxid");

          }
          // element.innerHTML =  element.innerHTML.replace(token_element, '<span class="recurring_element1" style="background-color:#abffab; font-size: 15px;">'+token_element+'</span>')
        }
      }
    }
    
    const search = clipboard_text.trim();
    // if(quick_search_button) quick_search_button.remove();
    
    const parent = document.querySelector("#app > div > div.wrap-white.block > div.settings-columns-wrap > div > div.input-group.export-wrap")

    if(search.startsWith('3') || search.startsWith('2')&&search.length<=10) {

    console.log("%c 🍄: functionclip_changed -> search ", "font-size:16px;background-color:#9e07ce;color:white;", search)
  quick_search_button.style.display='block'

  if(search.startsWith('3'))
{  quick_search_button.innerHTML=`<i class='fa fa-search'></i><i class='fa fa-file'></i> &nbsp;`+search
}
else{
  quick_search_button.innerHTML=`<i class='fa fa-search'></i><i class='fa fa-user'></i> &nbsp;`+search
}

  }
  else {

    if(search.length<15){
      quick_search_button.innerHTML=`<i class='fa fa-search'></i><i class='fa fa-info'></i> &nbsp;`+search
    }
    else{
    quick_search_button.style.display='none'}

  }
  }

  setInterval(function () {
    navigator.clipboard
      .readText()
      .catch((error) => {
        // console.log("error document not focused");
      })
      .then((clipText) => (clipboard_text = clipText));

    if (clipboard_text != prev_clipboard_text && clipboard_text != undefined) {
      // console.log("%c 🥅: clipboard_text ", "font-size:16px;background-color:#a69348;color:white;", clipboard_text)
      prev_clipboard_text = clipboard_text;
      clip_changed();
    }
  }, 300);

  setInterval(() => {
    this_table =
      document.querySelector(
        "#app > div > div.wrap-white.block > section > table"
      ) || document.createElement("div");
    // console.log("%c 🇲🇪: console ", "font-size:16px;background-color:#df5614;color:white;", 'this_table:' +this_table.textContent.length + ' prev_table:' +prev_table)

    if (prev_table !== this_table.textContent.length) {
      // console.log("%c ☪️: new_table ", "font-size:16px;background-color:#cd2579;color:white;", 'update ' + this_table.textContent.length)
      prev_table = this_table.textContent.length;

      attachButtons();

    }
    document.querySelector("#app > div > div.wrap-white.block > div.settings-columns-wrap > div > div.input-group.export-wrap").prepend(quick_search_button)
 
  }, 1000);

function delete_els_by_class_name(classname) {
  const els = document.getElementsByClassName(classname)
  
  while (els.length) {
    
    for (let index = 0; index < els.length; index++) {
      
      console.log("%c 💣: removed ", "font-size:16px;background-color:#649bd0;color:white;", els[index])
      els[index].remove();
    }
    
  }
  
  console.log("%c 👗: delete_els_by_class_name   done", "font-size:16px;background-color:#621933;color:white;", classname)
}

  function fill_input(id,items)
  {
    // console.log("%c 👕: items ", "font-size:16px;background-color:#3da9ac;color:white;", items[0])
    // console.log("%c 😋: id ", "font-size:16px;background-color:#d85a98;color:white;", id)
    // console.log("%c 🥡: fill_input ", "font-size:16px;background-color:#bdda10;color:black;", 'fill_input ' +id+' '+items)
    //change_subagent change_bank
    

    for (let index = 0; index < items.length; index++) {
      const element = items[index];
    let my_li = document.createElement('li')
// my_li.getAttribute()

function select_li() {
  

      // document.getElementById('change_subagent_multi').style.display=''
      // document.getElementById('change_subagent_multi').classList.add('hidden_el')
      if(id=='change_subagent'){
        delete_els_by_class_name('recurring_bank')

        document.getElementById('change_subagent_multi').style.display='none'

      document.getElementById('change_subagent_input').value =element.Name;
      global_subagent=element.id
      async function getbanks() {
        // Default options are marked with *
        const response = await fetch("https://managment.io/admin/changesubagent/getbanksbysubagentid", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrer": "https://managment.io/admin/report/recountingwebreplenishment",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": "{\"id\":"+element.id+"}",
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      getbanks().then((data) => {
      console.log("%c 🍠: getbanks().then((data) ", "font-size:16px;background-color:#3f10b8;color:white;", data)
        
        if (data.success) {
          
         fill_input('change_bank',data.data)
         document.getElementById('change_bank_multi').style.display='block'

        }
        else {
          document.getElementById('change_bank_input').value='no banks or access: ' + element.id
          console.log('no banks or access: ' + element.id )
        }

      });

    }
      else {
        global_bank=element.id
console.log('order '+global_order+' subagent '+global_subagent + ' bank '+element.id)
      document.getElementById('change_bank_multi').style.display='none'

      document.getElementById('change_bank_input').value =element.name;
      document.getElementById('change_sub_button').focus()
      console.log("%c 👫: focus! ", "font-size:16px;background-color:#ab1932;color:white;", document.getElementById('change_sub_button'))
      console.log("%c 🐩: element.getAttribute('data-id') ", "font-size:16px;background-color:#d35f29;color:white;", element)
      
     
   
    }
}

    my_li.addEventListener('click',function (event){
      select_li()
    })
    my_li.addEventListener('keyup',function (event) {

      if(event.key=='Enter')
      select_li()

    })


    my_li.setAttribute('data-id',element.id)
    my_li.setAttribute('tabIndex',index)
    // console.log("%c 🥗: element ", "font-size:16px;background-color:#8a244d;color:white;", element)
    // 

    // my_li.setAttribute('data-id',element.id)
    // console.log("%c 🥗: element ", "font-size:16px;background-color:#8a244d;color:white;", element)
    // 
    if(id=='change_subagent')
    {my_li.innerHTML= ` 
    <span data-select="" data-selected="" data-deselect="" class="multiselect__option ">
    <span>${element.Name}</span>
    </span>
    `
    my_li.classList.add('recurring_subagent') 

    my_li.addEventListener('keyup',function (event) {
      event.preventDefault();
      event.stopPropagation()

      if(event.key=='ArrowDown')
      {
        const arr_subs = document.querySelectorAll('.recurring_subagent[style*="display: block;"] ');
        let this_index = 0;

        arr_subs.forEach((el, index)=>{
          

          console.log(el)
          console.log('element.id '+element.id)
          if(el.getAttribute('data-id')==element.id)
          {
            if(index < arr_subs.length-1)
            this_index=index+1
            else 
            this_index=0
          }
        })
        arr_subs[this_index].focus()
        // console.log("%c 📔: arr_subs ", "font-size:16px;background-color:#5c3ec5;color:white;", arr_subs)

      }

      if(event.key=='ArrowUp')
      {
        const arr_subs = document.querySelectorAll('.recurring_subagent[style*="display: block;"] ');
        let this_index = 0;

        arr_subs.forEach((el, index)=>{
          

          console.log(el)
          console.log('element.id '+element.id)
          if(el.getAttribute('data-id')==element.id)
          {
            if(index != 0)
            this_index=index-1
            else 
            this_index=arr_subs.length-1
          }
        })
        arr_subs[this_index].focus()
        // console.log("%c 📔: arr_subs ", "font-size:16px;background-color:#5c3ec5;color:white;", arr_subs)

      }
    })

  }
  
    else {
      global_bank=element.id
      
      my_li.classList.add('recurring_bank')
          
console.log('order '+global_order+' subagent '+global_subagent + ' bank '+element.id)


      document.getElementById('change_bank_input').value =element.name;

      my_li.innerHTML= ` 
    <span data-select="" data-selected="" data-deselect="" class="multiselect__option ">
    <span>${element.name}</span>
    </span>
    `
    }


    // my_li.className='recurring_element'

    document.getElementById(id).appendChild(my_li)
    // console.log("%c 🌆: my_li appended to " + id, "font-size:16px;background-color:#168cf2;color:white;", my_li)

    }
document.getElementById(id+'_input').focus();
  }

  function makeButton(
    parent_element,
    order_id,
    ref_id,
    status,
    icon_class,
    hint,
    button_color,
    func,
    summa
    ,player_id
  ) {
    // console.log("%c 🇻🇪: status ", "font-size:16px;background-color:#a10125;color:white;", status)
    const approve_button = document.createElement("button");
    approve_button.setAttribute("data-tooltip", hint + " " + order_id);
    approve_button.setAttribute("data-position", "center top");
    approve_button.style.backgroundColor = button_color;

    const i_element = document.createElement("i");

    i_element.classList.add("fa", icon_class, "recurring_element");
    // i_element.classList.add("fa","fa-check-double", "recurring_element");

    approve_button.classList.add("btn", "btn-success", "recurring_element");

    approve_button.addEventListener("mouseover", function (params) {
      approve_button.style.backgroundColor = shadeColor(button_color, -30);
    });
    approve_button.addEventListener("mouseleave", function (params) {
      approve_button.style.backgroundColor = button_color;
    });
    if (!status) { //TODO subagent button
      
      console.log("%c 🇻🇪: status ", "font-size:16px;background-color:#a10125;color:white;", icon_class)

      
       global_ref_id = ref_id;
    

      approve_button.addEventListener(
        "click",
        function (
          event,
          id = order_id,
          ref = ref_id,
          stat = status,
          myfunc = func,
          amount = summa || "null"
        ) {
          global_order = order_id;
          global_player =player_id
          document.getElementById('change_div').style.display='flex'
          document.getElementById('change_order').textContent=order_id




          //TODO getsubs
          async function getsubs() {
            // Default options are marked with *
            const response = await fetch("https://managment.io/admin/changesubagent/getsubagnetbytransactionid", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json;charset=UTF-8",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
              },
              "referrer": "https://managment.io/admin/report/recountingwebreplenishment",
              "referrerPolicy": "strict-origin-when-cross-origin",
              "body": "{\"id\":\""+id+"\",\"ref_id\":"+ref+"}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
            return response.json(); // parses JSON response into native JavaScript objects
          }

          getsubs().then((data) => {
//TODO call fill_input
document.getElementById('change_subagent_multi').style.display='block'
            fill_input('change_subagent',data.data)


             console.log(data); // JSON data parsed by `data.json()` call data.total[0]
          });

        }
      );
    } else {
      if (!summa) {
        approve_button.addEventListener(
          "click",
          function (
            event,
            id = order_id,
            ref = ref_id,
            stat = status,
            myfunc = func,
            amount = summa || "null"
          ) {
            // Example POST method implementation:

            async function postData(order, refID, stat, amount) {
              // Default options are marked with *
              const response = await fetch(
                "https://managment.io/admin/report/recountingwebreplenishment",
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
                  referrer:
                    "https://managment.io/admin/report/recountingwebreplenishment",
                  referrerPolicy: "strict-origin-when-cross-origin",
                  body:
                    '{"status":' +
                    stat +
                    ',"summa":' +
                    amount +
                    ',"new_number":null,"order_ids":"' +
                    order +
                    '","comment":"","ref_id":' +
                    refID +
                    ',"field_id":null,"field":""}',
                  method: "POST",
                  mode: "cors",
                  credentials: "include",
                }
              );
              return response.json(); // parses JSON response into native JavaScript objects
            }

            postData(id, ref, stat, amount).then((data) => {
              myfunc(data);

              // console.log(); // JSON data parsed by `data.json()` call data.total[0]
            });
          }
        );
      } else { //TODO amount edit
        global_ref_id = ref_id;
        approve_button.addEventListener(
          "click",
          function (
            event,
            id = order_id,
            ref = ref_id,
            stat = status,
            myfunc = func,
            amount = summa || "null"
          ) {
            document.querySelector("#amount_trx").textContent = order_id;
            document.querySelector("#amount_input").value = summa;
            document.querySelector("#amount_div").style.display = "flex";
            document.querySelector("#amount_input").select();
          }
        );
      }
    }
    approve_button.appendChild(i_element);
    parent_element.appendChild(approve_button);
  }

  function attachButtons() {

    
    let prev_buttons = document.getElementsByClassName("recurring_element");

    while (prev_buttons.length) {
      // console.log("Found buttons " + prev_buttons.length);
      for (let index = 0; index < prev_buttons.length; index++) {
        // console.log(prev_buttons[index].textContent + " removing ");

        // console.log("%c 🔳: attachButtons -> prev_buttons[index] ", "font-size:16px;background-color:#908fe7;color:white;", prev_buttons[index])
        prev_buttons[index].remove();
      }
      prev_buttons = document.getElementsByClassName("recurring_element");
    }
    let table = document.querySelector(
      "#app > div > div.wrap-white.block > section > table "
    );
    if(table==null) {
      console.log('no table');
      return }
    

    for (let index = 0; index < table.childNodes.length; index++) {
      const element = table.childNodes[index];

      if (element.nodeName == "TR") {
        if (index === 0) {
          const mytext = document.createElement("th");
          mytext.classList.add("recurring_element");

          mytext.textContent = "Actions";

          element.prepend(mytext);
          prev_table = table.textContent.length;
          continue;
        }
        if (table.childNodes[index + 1].nodeName != "#text") {
          let ref_id = element.textContent.substring(
            element.textContent.indexOf("RefId"),
            element.textContent.indexOf("RefId") + 10
          );
          ref_id = ref_id.substring(
            ref_id.indexOf(":") + 2,
            ref_id.indexOf(")")
          );

          const mytd = document.createElement("td");
          mytd.classList.add("recurring_element", "btn_container");

          const order_id = element.childNodes[0].textContent.trim();
          const player_id = element.childNodes[1].textContent.trim();
          // const trx_amount = parseInt(
          //   element.childNodes[3].textContent.replace(' ','')
          //   10
          // );
          const trx_amount = element.childNodes[3].textContent.replace(
            /\s/g,
            ""
          );
          // const trx_amount2 = trx_amount.split( ' ').join('');
          // trx_amount=trx_amount

          //TODO call make button
          makeButton(
            mytd,
            order_id,
            ref_id,
            3,
            "fa-check-double",
            "Approve",
            "#40cf55",
            function (data) {
              console.log(data);

              showSnack(
                JSON.stringify(
                  data.data.total[0].zakaz +
                    " " +
                    data.data.total[0].stat +
                    " " +
                    data.data.total[0].resultat
                ),
                data.data.total[0].stat == " Ошибка!" ? "red" : "green",
                order_id,
                player_id,
                3
              );
            },
            false
          );

          makeButton(
            mytd,
            order_id,
            ref_id,
            2,
            "fa-ban",
            "Cancel payment (refund the amounts recerved)",
            "#cf5d40",
            function (data) {
              console.log(data);

              showSnack(
                JSON.stringify(
                  data.data.total[0].zakaz +
                    " " +
                    data.data.total[0].stat +
                    " " +
                    data.data.total[0].resultat
                ),
                data.data.total[0].stat == " Ошибка!" ? "red" : "green",
                order_id,
                player_id,
                2
              );
            },
            false
          );

          makeButton(
            mytd,
            order_id,
            ref_id,
            10,
            "fa-edit",
            "Change amount",
            "#cacf40",
            function (data) {
              console.log(data);

              showSnack(
                JSON.stringify(
                  data.data.total[0].zakaz +
                    " " +
                    data.data.total[0].stat +
                    " " +
                    data.data.total[0].resultat
                ),
                data.data.total[0].stat == " Ошибка!" ? "red" : "green",
                order_id,
                player_id,
                10
              );
            },
            trx_amount
            //document.getElementById('new_summa').value()
          );

          makeButton(
            mytd,
            order_id,
            ref_id,
            "",
            "fa-exchange-alt",
            "Change subagent for a transaction",
            "#40cacf",
            function (data) {},
            false,
            player_id
          );

          element.prepend(mytd);

          //escaping changes
          const table1 = document.querySelector(
            "#app > div > div.wrap-white.block > section > table "
          );
          prev_table = table1.textContent.length;
        } else {
          const empty_td = document.createElement("td");
          empty_td.classList.add("recurring_element", "btn_container");

          table.childNodes[index].prepend(empty_td);
        }
      }

      // }
    }

    var tooltip = new Tooltip({
      theme: "blue", // Selects one of the pre-defined tooltip styles - light or dark.
      distance: 5, // Specifies the distance in pixels from trigger to tooltip.
      delay: 0, // Specifies how long the tooltip remains visible (in ms) after the mouse leaves the trigger.
    });

    console.log("attachButtons done");
    clip_changed();
  }

})();
