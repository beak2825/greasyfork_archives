// ==UserScript==
// @name      CSKH-AUTOFILL
// @namespace https://b2a.vnptnghean.com.vn
// @include   https://b2a.vnptnghean.com.vn/*
// @version   1
// @grant     none
// @license   MIT
// @description Autofill for CSKH VNPT NgheAn
// @downloadURL https://update.greasyfork.org/scripts/513877/CSKH-AUTOFILL.user.js
// @updateURL https://update.greasyfork.org/scripts/513877/CSKH-AUTOFILL.meta.js
// ==/UserScript==

const getAllProperties = (o, e = o, props = []) => e.__proto__ ? getAllProperties(o, e.__proto__, props.concat(Object.getOwnPropertyNames(e))) : Object.fromEntries([...new Set(props.concat(Object.getOwnPropertyNames(e)))].map(prop => [prop, o[prop]]));

function interceptFiberObj(obj, text) { // intercepting textarea object due to some insane React shenanigan
  // console.log(obj, getAllProperties(obj), text);
  obj.value = text;
  obj.dispatchEvent(new Event("change", {'bubbles': true}));
  return;
	for (const k in getAllProperties(obj)) {
    // console.log(k);
    v = obj[k];
  	if(k.includes("__reactFiber")) {
    	// intercept memoizedProps/pendingProps
      console.log("Intercepting fiber: ", k, v);
      v.memoizedProps.value = text;
      v.pendingProps.value = text;
    } else if (k.includes("__reactProp")) {
    	v.value = text;
      console.log("Intercepting prop: ", k, v);
    }
  }
}

function findTagByText(text, tag="div", source=document.body) {
	var elems = source.getElementsByTagName(tag);
  for(let i=0;i<elems.length;i++) {
  	if(elems[i].textContent.trim() == text) { return elems[i]; }
  }
  return null;
}

function findImageUnderText(text, return_node=false) {
	var header_div = findTagByText(text);
  var image_div = header_div.nextSibling;
  if(!image_div) { return null; }
  var image_imgs = image_div.getElementsByTagName("img");
  //console.log(text, image_imgs);
  if(image_imgs.length == 0) { return null; }
  // console.log(text, image_imgs[0], image_imgs[0].src);
  if(return_node) return image_imgs[0];
  return image_imgs[0].src;
}

function checkTextInInput(input_id) {
	var input_item = document.getElementById(input_id);
  return input_item.value ? input_item.value.trim() : input_item.value;
}

var is_cn1 = null;
var errors = [];
var toggle_b2a_error = null;

function fillByErrors() {
  var form_section = findTagByText("Đánh giá", tag="button").parentNode;
  var bad_checkbox = findTagByText("Không đạt", "span", source=form_section).previousSibling;
  var good_checkbox = findTagByText("Đạt", "span", source=form_section).previousSibling;
   var error_field = document.getElementById("control-hooks_noi_dung_danh_gia");
  console.log(errors, form_section);
  error_field.focus();
  if(errors.length > 0) {
    // has error; fill + click invalid checkbox
    // error_field.value = errors.join("\r\n");
    interceptFiberObj(error_field, errors.join("\r\n"));
    //console.log(findTagByText("Không đạt", "span"), findTagByText("Không đạt", "span").previousSibling);
    bad_checkbox.click();
  } else {
    // no error, click valid checkbox;
    //console.log(findTagByText("Đạt", "span", source=form_section), findTagByText("Đạt", "span", source=form_section).previousSibling);
    //error_field.value = "";
    interceptFiberObj(error_field, "");
    good_checkbox.click();
  }
  error_field.click();
}

function toggleB2A() {
	if(toggle_b2a_error == true) {
  	// true means has an error; retract last & 
    errors.pop();
    toggle_b2a_error = false;
  } else if(toggle_b2a_error == false) {
  	errors.push("Chưa có hình ảnh thực hiện B2A tại địa chỉ khách hàng, có toạ độ, địa chỉ kèm theo");
    toggle_b2a_error = true;
  } else {
  	// null; dont do shit
  }
  console.log(toggle_b2a_error, errors);
  fillByErrors();
}

function checkAndDisplay() {
  // used on a per-case basis
  const check_element = document.getElementById("autopanel");
  if(check_element === null && document.getElementById("control-hooks")) {
  	console.log("Element is not created (likely wiped); reinitializing");
    var text = document.getElementById("control-hooks").textContent;
    if(text !== null) {
      // CN1 or CN2?
    	is_cn1 = text.includes("CN1");
      // wipe error 
      errors.length = 0;
      // shared between 1 & 2
      if(!checkTextInInput("control-hooks_so_dien_thoai_truc_tiep")) {
      	errors.push("Chưa có SĐT người gặp trực tiếp");
      }
      
      if(is_cn1) {
      	// 1 exclusive
        //console.log(checkTextInInput("control-hooks_long_phieukhaosat"), checkTextInInput("control-hooks_lat_phieukhaosat"))
        if(!checkTextInInput("control-hooks_long_phieukhaosat") || !checkTextInInput("control-hooks_lat_phieukhaosat")) {
          errors.push("Chưa có tọa độ");
        }

        if(!findImageUnderText("Ảnh làm gọn thuê bao (TTVT thực hiện)")) {
          errors.push("Chưa có Ảnh làm gọn thuê bao");
        }
        if(!findImageUnderText("Ảnh vệ sinh đầu cuối, dán tem CSKH (TTVT thực hiện)")) {
          errors.push("Chưa có Ảnh vệ sinh đầu cuối, dán tem");
        }
      } else {
      	// 2 exclusive
        thumbnail = findImageUnderText("Ảnh thực hiện B2A (TTKD thực hiện)");
        if(!thumbnail) {
          toggle_b2a_error = null;
          // no image; depend on mode, just push in & disable toggling regardless
          if(findImageUnderText("Ảnh làm gọn thuê bao (TTVT thực hiện)") ||
            	findImageUnderText("Ảnh vệ sinh đầu cuối, dán tem CSKH (TTVT thực hiện)") ||
            	findImageUnderText("Ảnh modem đã thay thế (TTVT thực hiện)")) {
            // has replacement, just take as-is
            console.log("Found replacement image; ignore & consider correct.");
          } else {
            // no replacement, push error
        		errors.push("Chưa có hình ảnh thực hiện B2A tại địa chỉ khách hàng, có toạ độ, địa chỉ kèm theo");
          }
        }else {
          image = findImageUnderText("Ảnh thực hiện B2A (TTKD thực hiện)", true).click();
          toggle_b2a_error = false;
        	// show the image as necessary; default the b2a is correct (toggle=false)
//           let ext_dot = thumbnail.lastIndexOf(".");
//           let img_full_path = null;
//           let base = thumbnail.substring(0, ext_dot);
//           console.log(base, img_full_path);
//           if(base.includes("_thumb")) {
//           	img_full_path = base.split("_thumb")[0];
//           } else {
//            	img_full_path = base; 
//           }
          // also remove the middle "khaosat" duplicate section if any
//           const pieces = img_full_path.split("/khaosat");
//           img_full_path = pieces[0] + "/khaosat" + pieces[pieces.length-1] + thumbnail.substring(ext_dot, thumbnail.length);
           
//           console.log("Show image", thumbnail, "->", img_full_path);
//           var b2a_image = document.createElement("img");
//           b2a_image.src = img_full_path;
//           b2a_image.setAttribute("style", "position:absolute;bottom:20px;right:600px;height:100%;width:auto;z-index:998");
//       		document.body.insertBefore(b2a_image, document.body.firstChild);
//           toggle_b2a_error = false;
        }
      }
      
      // show that the check is finished & item is done.
      var input = document.createElement("button");
      input.id = "autopanel";
      input.setAttribute("style", "font-size:18px;position:absolute;bottom:0px;right:20px;z-index:999");
      input.textContent=(is_cn1 ? "OK" : "Ảnh không có Coord");
      input.onclick = toggleB2A;
      document.body.insertBefore(input, document.body.firstChild);
      console.log("Errors if any:", errors)
      
  		fillByErrors();
      
      
    } else {
    	return; // don't have anything; just ignore
    }
  }
}

var injected = false;

function checkAndInject() {	
	// integrate dashboard mode - replace all onclick available
  var table = document.body.getElementsByTagName("tbody")[0];
  if(table && table.children.length > 0 && !table.children[0].classList.contains("ant-table-placeholder") && !table.children[0].classList.contains("depleted_row_cls")) {
  	// has item, started injecting by replacing all onclick
    for(let i=0; i<table.children.length; i++) {
    	let row = table.children[i];
      let callback = row.onclick;
      let wrapper = function(_extra, _target=row, _callback=callback) { 
        //console.log(_target.classList);
        _target.classList.add("depleted_row_cls"); 
        //console.log(_target.classList);
        _target.classList.remove("table-row-even"); 
        _target.classList.remove("table-row-odd");
        //console.log(_target.classList);
        _callback(_extra); 
      };
      row.onclick = wrapper;
      //console.log(row, row.classList, wrapper, callback);
    }
    injected = true;
  }
}

function shortcutContinue(dashboard_mode) {
	// function to trigger depending on mode (in dashboard or checker)
  // if checker & at image preview, jump it
  // if checker & passed, confirm it
  // if dashboard, trigger the next unworked item; or refresh the page if no more unworked item
  if(dashboard_mode) {
    // for now get either of even/odd and 
    let table_row_even = document.getElementsByClassName("table-row-even");
    let table_row_odd = document.getElementsByClassName("table-row-odd");
    if(table_row_even.length > 0) {
    	table_row_even[0].click();
    } else if(table_row_odd.length > 0) {
    	table_row_odd[0].click();
    } else {
    	window.location.reload();
    }
  } else {
    let image_preview = document.getElementsByClassName("ant-image-preview-operations-wrapper");
    console.log(image_preview, image_preview.length);
    if(image_preview.length > 0) {
      // at image preview, dismiss it with the image close
      document.getElementsByClassName("ant-image-preview-close")[0].click();
    } else {
      // at normal, click confirm
			findTagByText("Đánh giá", tag="button").click();
    }
  }
}

var dashboard_mode = true;
if (window.location.href.includes("dashboard")) {
  // dashboard integration mode
  var depleted_row_cls = `.depleted_row_cls {
  	background-color: yellow;
  }
  .depleted_row_cls:hover {
  	background-color: yellow;
  }`;
  var styleSheet = document.createElement("style")
  styleSheet.textContent = depleted_row_cls
  document.head.appendChild(styleSheet)
  setInterval(checkAndInject, 250);
} else {
  // per-case mode
	setInterval(checkAndDisplay, 250);
  dashboard_mode = false;
}

var in_escape_mode = false;
var always_proceed_key = 19;  // pause-break
var accepted_keys = [32, 13]; // space or enter; normally will proceed, but upon escape will not be accepted to allow editing as normal
var escape_key = 27;					// escape

(window.opera ? document.body : document).addEventListener('keydown', function(e) {
    //alert(e.keyCode); //uncomment to find more keyCodes
    console.log(e.keyCode, accepted_keys.indexOf(e.keyCode));
  	if (e.keyCode == escape_key) {
      // if escape, in addition to doing anything normal, disable the space/enter as proceed.
      in_escape_mode = true;
    } else if (e.keyCode == always_proceed_key || (!in_escape_mode && accepted_keys.indexOf(e.keyCode) >= 0)) {
      // press the always proceed, or escape mode has not being triggered yet.
    	// alert("Gotcha!"); //uncomment to check if it's being triggered instead of the cont fn
      shortcutContinue(dashboard_mode)
    }
    return false;
}, !window.opera);