// ==UserScript==
// @name        CopyCurriculum
// @namespace   portal.kuzstu.ru
// @description Копирование текущей РП в другие планы и дисциплины
// @include     https://portal.kuzstu.ru/learning/curriculum/plan/curriculum_editing?plan_id=*&discipline_id=*
// @require	    https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version     1.4.2
// @grant       none
// @license     CC0 (Creative Commons Zero)
// @downloadURL https://update.greasyfork.org/scripts/33455/CopyCurriculum.user.js
// @updateURL https://update.greasyfork.org/scripts/33455/CopyCurriculum.meta.js
// ==/UserScript==
var myDiv;
var version = "1.4.2";
$(function() {
  var place = $(".modal-header:last");
  var newPlace = $("<div></div>").attr("class", "well-small");
  newPlace.append($("<h4>Копирование РП в любой план/дисциплину</h4>"));
  var btn =
      $("<button></button>")
      .attr("class", "btn btn-primary")
      .text("Показать/Скрыть")
      .click(function() {$("#copy-to-other").toggle()});
  newPlace.append(btn);
  myDiv = $("<div/>").attr("id", "copy-to-other");
  var copyForm = $("<form/>").attr({
    "class":"form-horizontal",
    "style":"margin-bottom:0px;",
    "role":"form","autocomplete":"off"
  }).submit(function() {return false;});
  var fieldSet = $("<fieldset/>");
  fieldSet.append(myDiv);
  copyForm.append(fieldSet);
  newPlace.append(copyForm);
  place.after(newPlace);
  install_div();
  unlock_button();
});

function unlock_button() {
  $(".savechanges:first").removeAttr("disabled");
}

function install_div() {
  myDiv.empty();
  myDiv.hide();
  add_help();
  add_institutes();
}

function add_help() {
  myDiv.append(
    '<p>\
    <b>Внимание!</b><br/>\
    Убедительная просьба внимательно ознакомиться с \
    <a href="https://docs.google.com/document/d/1O5R4wgWqRRWgcinUQXKq81VJ0mZYmunsa0wcwxte480/edit?usp=sharing">\
    инструкцией по копированию РП в конструкторе</a>.<br/>\
    Также убедитесь, что вы пользуетесь самой свежей версией скрипта. Текущая версия <b>' +
    version + '</b>, скрипт можно установить \
    <a href="https://greasyfork.org/ru/scripts/33455-copycurriculum">здесь</a> (рекомендуемый вариант с возможностью автоматического обновления) или \
    <a href="https://gist.github.com/dvhex/8ba5959ae81679a6f8cb666aa31b321c">здесь</a> (по кнопке "Raw").<br/>\
    Ниже выберите учебный план, куда вы хотите скопировать текущую рабочую программу.\
    </p>'
  );
}

function add_institutes() {
  create_select_element(
    "/api/institutes",
    "institute_id",
    "Институт",
    add_directions,
    function(obj) {
      return {"id":obj.id, "name":obj.name};
    }
  );
}

function add_directions() {
  create_select_element(
    "/api/directions?institute="+$(this).val(),
    "direction_id",
    "Направление",
    add_plans,
    function(obj) {
      return {
        "id":obj.id,
        "name":obj.new_code + ' ' + obj.specialization_name + ' (' + obj.form_name + ', ' + obj.program_name + ')'
      };
    }
  );
}

function add_plans() {
  create_select_element(
    "/api/plans?direction="+$(this).val(),
    "plan_copy_id",
    "Год УП",
    add_disciplines,
    function(obj) {
      return {"id":obj.id,"name":obj.year};
    }
  );
}

function add_disciplines() {
  create_select_element(
    "/api/disciplines?plan=" + $(this).val(),
    "discipline_copy_id",
    "Дисциплина (если отличается)",
    undefined,
    function(obj) {
      if (obj.department_id != $("#discipline_department_id").val())
        return undefined;
      return {"id":obj.discipline_id,"name":obj.discipline_name};
    }
  );
  add_save_button();
}

function add_save_button() {
  if ($("#copy-btn").length > 0) return;
  var btn = $("<button/>")
    .text("Приступить к копированию")
    .attr({"id":"copy-btn","class":"btn btn-primary"})
    .click(changeIds);
  myDiv.append(btn);
}

function changeIds() {
  var plan_id = $("#plan_copy_id").val();
  if (plan_id === "") {
    alert("Не выбран учебный план для копирования!");
    return;
  }
  setValueForElementsByName("plan_id", plan_id);
  setValueForElementsByName("add_plans", plan_id);
  var d_id = $("#discipline_copy_id").val();
  if (d_id !== "") {
    setValueForElementsByName("discipline_id", d_id);
  }
  else
    d_id = $("#discipline_id").val();
  add_info(plan_id, d_id);
}

function add_info(plan_id, d_id) {
  var url = "https://portal.kuzstu.ru/learning/curriculum/plan/curriculum_editing?plan_id=" +
      plan_id + "&discipline_id=" + d_id;
  myDiv.append(
    '<p>\
Текущая рабочая программа готова к копированию. Далее необходимо вручную нажать клавиши "Сохранить компетенцию" \
для всех компетенций, которые нужно скопировать, а также клавишу "Сохранить" внизу страницы для \
копирование всей рабочей программы.<br/>\
<b>Теперь, если вам нужно внести изменения в текущую рабочую программу, то необходимо перезагрузить страницу!</b>\
    </p><p>После сохранения РП страница будет перезагружена, и для повторного копирования нужно \
    заново выбрать учебный план и дисциплину.</p>\
    <p>Контруктор РП, куда вы собираетесь сохранить изменения, находится по ссылке: <a href="' + url +
    '">' + url + '</a>.</p>'
  );
}

function setValueForElementsByName(name, value) {
  $("[name="+name+"]:input").val(value);
}

function create_select_element(url, name, description, onchange, callback) {
  var sel = $("#" + name);
  if (sel.length===0) {
    sel = mk_new_select_in_control_group(name, description, onchange);
  }
  sel.empty();
  sel.append('<option value="">Ничего не выбрано</option>');
  $.getJSON(url, function(data) {
    var values = [];
    $(data).each(function(index, obj) {
      var res = callback(obj);
      if (res !== undefined)
        values.push(res);
    });
    values.sort(function(a, b) {
      if (a.name > b.name)
        return 1;
      if (a.name < b.name)
        return -1;
      return 0;
    });
    $(values).each(function(index, obj) {
      sel.append('<option value="' + obj.id + '">' + obj.name + '</option>');
    });
    sel.parent().parent().show();
  });
  return sel;
}

function mk_new_select_in_control_group(name, description, onchange) {
  var controlGroup = $("<div/>").attr("class", "control-group");
  var label = $("<label/>").attr({"class":"control-label","for":name}).text(description);
  controlGroup.append(label);
  var sel = $("<select/>").attr({
    "id":name,
    "name":name,
    "class":"span7",
    "dataContainer":"body"
  }).on("change", onchange);
  var controls = $("<div/>").attr("class","controls");
  controls.append(sel);
  controlGroup.append(controls);
  controlGroup.hide();
  myDiv.append(controlGroup);
  myDiv.append($("<br/>")); // Костыль
  return sel;
}