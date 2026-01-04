// ==UserScript==
// @name         Block_Obj
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @homepage     https://greasyfork.org/zh-CN/users/193133-pana
// @version      3.0.3
// @description  屏蔽内容对象库
// @author       pana
// @license      GNU General Public License v3.0 or later
// ==/UserScript==

const BLOCK_STYLE = `
  .block_obj_wrap_div {
    background-color: #222222;
    border-radius: 3px;
    border: 1px solid #282A36;
    bottom: 6vh;
    box-shadow: 0 0 5px #282A36;
    color: #D3D3D3;
    font-size: 13px;
    margin: 0px;
    padding: 0px;
    position: fixed;
    text-align: left;
    transition: 0.8s;
    width: 520px;
    z-index: 99999;
  }
  .block_obj_show_wrap {
    display: block;
    right: 0;
  }
  .block_obj_hidden_wrap {
    right: -530px;
  }
  .block_obj_main_fieldset {
    border-radius: 3px;
    border: 3px groove #00A1D6;
    height: auto;
    margin: 8px;
    min-width: 300px;
    padding: 4px 9px 6px 9px;
    width: auto;
  }
  .block_obj_ul_node {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }
  .block_obj_checkbox_li {
    display: inline-block;
    margin-top: 5px;
  }
  .block_obj_checkbox_input {
    clip: rect(0, 0, 0, 0);
    position: absolute;
  }
  .block_obj_checkbox_label {
    cursor: help;
    vertical-align: middle;
  }
  .block_obj_checkbox_input + label::before {
    background-color: silver;
    border-radius: 0.1em;
    color: #FFF;
    content: "\\a0";
    display: inline-block;
    height: 1em;
    line-height: 85%;
    margin-right: 0.5em;
    text-align: center;
    vertical-align: 0.2em;
    width: 1em;
    cursor: pointer;
  }
  .block_obj_checkbox_input:checked + label::before {
    background-color: #00A1D6;
    content: "\\2713";
  }
  .block_obj_separator_text {
    color: #FFB86C;
    margin-top: 5px;
  }
  .block_obj_separator_symbol {
    background-color: #303030;
    height: 2px;
    margin-bottom: 5px;
    margin-top: 5px;
    min-width: 400px;
  }
  .block_obj_input_div {
    margin-top: 5px;
  }
  .block_obj_input {
    background-color: #C0C0C0;
    border: 1px solid #C0C0C0;
    color: #000;
    font-size: 13px;
    min-height: 1.5em;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 4px;
  }
  .block_obj_keyword_input {
    width: 220px;
  }
  .block_obj_input_btn {
    background-color: #3da9cc;
    border-radius: 3px;
    border: 1px solid #73C9E5;
    box-shadow: 0 0 4px #73C9E5;
    color: #FFF;
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    margin-left: 5px;
    text-align: center;
    vertical-align: bottom;
    white-space: nowrap;
    width: 30px;
  }
  .block_obj_list_div {
    margin-top: 5px;
  }
  .block_obj_list_textarea_div {
    border: 1px dotted #00A1D6;
    margin-top: 3px;
    max-height: 65px;
    min-height: 3px;
    overflow: auto;
  }
  .block_obj_list_textarea_div::-webkit-scrollbar {
    background-color: #979797;
    border-radius: 5px;
    width: 10px;
  }
  .block_obj_list_textarea_div::-webkit-scrollbar-thumb {
    background-color: #404040;
    border-radius: 5px;
  }
  .block_obj_button_clicked {
    color: #000;
  }
  .block_obj_child_span {
    background-color: #3D3D3D;
    border-radius: 5px;
    border: 1px solid #3D3D3D;
    display: inline-block;
    margin: 3px;
    padding: 2px;
    min-height: 18px;
  }
  .block_obj_child_text {
    border-right: 1px solid #A9181C;
    margin-right: 4px;
    padding-right: 4px;
  }
  .block_obj_child_green {
    color: #41B349;
  }
  .block_obj_child_del {
    color: #A9181C;
    cursor: pointer;
  }
  .block_obj_list_textarea_expand {
    max-height: 720px;
  }
  .block_obj_li_hide {
    display: none;
  }
  .block_obj_button {
    background-color: #FB7299;
    border-radius: 4px;
    border: 1px solid #FB7299;
    color: #FFF;
    cursor: pointer;
    margin-top: 5px;
    padding: 2px 4px;
    position: relative;
    min-height: 1em;
  }
  .block_obj_save_button {
    float: right;
    margin-right: 5px;
  }
  .block_obj_cancel_button {
    float: left;
    margin-left: 5px;
  }
  .block_obj_expand_box {
    bottom: 0px;
    height: 6vh;
    position: fixed;
    right: -6vw;
    transition: 0.5s;
    width: 12vw;
    z-index: 99999;
  }
  .block_obj_show_expand_box {
    right: 0;
    width: 6vw;
  }
  .block_obj_expand_span {
    background-color: #00A1D6;
    border-radius: 19px;
    border: 1px solid #00A1D6;
    bottom: 1vh;
    color: #FFF;
    cursor: pointer;
    display: block;
    font-size: 13px;
    height: 38px;
    line-height: 38px;
    position: absolute;
    right: 1vw;
    text-align: center;
    width: 38px;
    z-index: 99999;
    user-select: none;
  }
  .block_obj_expand_span:hover {
    box-shadow: 0 0 5px 1px green;
  }
  .block_obj_move_right {
    margin-left: 15px;
  }
  .block_obj_none {
    display: none !important;
  }
  .block_obj_hidden {
    visibility: hidden !important;
  }
  .block_obj_presentation_div {
    display: flex;
    position: fixed;
    background-color: rgba(0, 0, 0, .5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    align-items: center;
    justify-content: center;
  }
  .block_obj_dialog_div {
    position: relative;
    width: 400px;
    background-color: #4e5654;
    border: 0 solid #000;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
  }
  .block_obj_big_bang_top_part {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .block_obj_big_bang_h3 {
    font-size: 20px;
    color: #fff;
    margin-left: 5px;
    background-color: #4e5654;
    border-color: #4e5654;
  }
  .block_obj_big_bang_deselect_btn {
    float: right;
    margin-top: 5px;
    margin-right: 5px;
    color: #2a2a92;
    cursor: pointer;
  }
  .block_obj_big_bang_middle_part {
    margin-top: 5px;
    margin-bottom: 5px;
    max-height: 500px;
    overflow-y: auto;
  }
  .block_obj_big_bang_text {
    background-color: #3e3939;
    color: #fff;
    padding: 5px;
    margin: 4px;
    font-size: 16px;
    display: inline-block;
    border-radius: 99px;
    cursor: pointer;
    user-select: none;
  }
  .block_obj_big_bang_text_selected {
    background-color: #3636b1 !important;
  }
  .block_obj_big_bang_bottom_part {
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;
  }
  .block_obj_big_bang_add_btn, .block_obj_big_bang_copy_btn {
    display: inline-block;
    padding: 10px;
    color: #fff;
    background-color: #325561;
    cursor: pointer;
    border-radius: 99px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .block_obj_big_bang_add_btn:hover, .block_obj_big_bang_copy_btn:hover {
    color: #2a2a92;
  }
`;
class Block_Obj {
  constructor(configKey, regConversion = []) {
    this.wrapDiv = null;
    this.mainFieldset = null;
    this.ulNode = null;
    this.style = null;
    this.saveField = [];
    this.onSave = null;
    this.onChange = null;
    this.field = [];
    this.configKey = configKey;
    this.regConversion = regConversion;
    this.config = {};
    this.timer = null;
    this.saveTimer = null;
    this.cancelTimer = null;
  }
  async init(initialization) {
    if (!this.id) {
      this.id = initialization.id ? 'blockObj_' + initialization.id : 'blockObj_' + Block_Obj.count;
      !initialization.id && Block_Obj.count++;
    }
    this.config = await this.readConfig();
    this.regConversion.forEach(item => {
      const { ori, key } = item;
      if (ori && this.config[ori] != undefined) {
        this.config[key] = this.config[key].concat(this.config[ori]);
        delete this.config[ori];
      }
    });
    this.display = initialization.display ? true : false;
    if (initialization.events) {
      if (typeof initialization.events['save'] === 'function') {
        this.onSave = initialization.events['save'];
      }
      if (typeof initialization.events['change'] === 'function') {
        this.onChange = initialization.events['change'];
      }
    }
    this.style = document.createElement('style');
    this.style.innerHTML = BLOCK_STYLE;
    document.body.appendChild(this.style);
    if (initialization.style && typeof initialization.style === 'string') {
      const externalStyle = document.createElement('style');
      externalStyle.innerHTML = initialization.style;
      document.body.appendChild(externalStyle);
    }
    !this.wrapDiv && this.createSettingsPanel();
    this.field = initialization.field;
    this.settingsPanel();
    Block_Obj.GM.registerMenuCommand(initialization.menu, () => this.expandWrap());
    Block_Obj.GM.addValueChangeListener(this.configKey, (_name, _oldValue, newValue, remote) => {
      if (remote) {
        this.destroyAndRebuild(newValue);
        typeof this.onChange === 'function' && this.onChange(this.getConfig());
      }
    });
    const expandBox = document.createElement('div');
    expandBox.className = 'block_obj_expand_box';
    expandBox.onmouseenter = function () {
      this.classList.add('block_obj_show_expand_box');
    };
    expandBox.onmouseleave = function () {
      this.classList.remove('block_obj_show_expand_box');
    };
    const hoverButton = {};
    if (initialization.hover_button) {
      Object.assign(hoverButton, initialization.hover_button);
    }
    const expandSpan = document.createElement('span');
    expandSpan.id = this.id + '_expandSpan';
    expandSpan.className = 'block_obj_expand_span';
    expandSpan.textContent = hoverButton.label == null ? '屏蔽' : hoverButton.label;
    expandSpan.title = hoverButton.title == null ? '显示/隐藏屏蔽设置' : hoverButton.title;
    expandSpan.addEventListener('click', () => {
      this.expandWrap();
      if (hoverButton.click && typeof hoverButton.click === 'function') {
        hoverButton.click(expandSpan);
      }
    });
    expandBox.appendChild(expandSpan);
    document.body.appendChild(expandBox);
  }
  settingsPanel() {
    if (Array.isArray(this.field)) {
      this.field.forEach(ele => {
        if (!this.wrapDiv.querySelector('#' + this.id + '_' + (ele.id ? ele.id : ''))) {
          switch (ele.type.toLowerCase()) {
            case 'separator':
            case 's':
              this.insertSeparator(ele.id, ele.label, ele.title, ele.classname);
              break;
            case 'br':
            case 'b':
              this.insertBr(ele.classname);
              break;
            case 'input':
            case 'i':
              this.insertInput(ele.list_id, ele.id, ele.label, ele.title, ele.placeholder, ele.classname, ele.campare);
              break;
            case 'list':
            case 'l':
              this.insertList(ele.id, this.config[ele.id] == null ? ele.default : this.config[ele.id], ele.label, ele.title, ele.classname);
              break;
            case 'checkbox':
            case 'c':
            default:
              this.insertCheckbox(
                ele.id,
                ele.label,
                ele.title,
                this.config[ele.id] == null ? ele.default : this.config[ele.id],
                ele.classname,
                ele.move_right
              );
              break;
          }
        }
      });
    }
    const saveButton = this.createSpanBtn('block_obj_button block_obj_save_button', '保存并关闭', '保存设置并关闭设置窗口', e => {
      this.expandWrap();
      this.saveConfig();
    });
    const onlySaveButton = this.createSpanBtn('block_obj_button block_obj_save_button', '仅保存', '仅保存设置', e => {
      onlySaveButton.textContent = '已保存';
      this.saveTimer && window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
      this.saveTimer = window.setTimeout(() => {
        onlySaveButton.textContent = '仅保存';
      }, 1000);
      this.saveConfig();
    });
    const cancelButton = this.createSpanBtn('block_obj_button block_obj_cancel_button', '取消', '关闭设置窗口', e => {
      this.expandWrap();
      this.cancelTimer && window.clearTimeout(this.cancelTimer);
      this.cancelTimer = null;
      this.cancelTimer = window.setTimeout(() => {
        this.display = false;
        this.destroyAndRebuild();
      }, 800);
      e.stopPropagation();
    });
    this.ulNode.appendChild(saveButton);
    this.ulNode.appendChild(onlySaveButton);
    this.ulNode.appendChild(cancelButton);
    document.body.appendChild(this.wrapDiv);
  }
  getConfig() {
    const realConfig = {};
    Object.assign(realConfig, this.config);
    this.regConversion.forEach(item => {
      const { key } = item;
      realConfig[key] = this.convertArray(realConfig[key]);
    });
    return realConfig;
  }
  async readConfig() {
    let config = {};
    if (this.configKey) {
      config = await Block_Obj.GM.getValue(this.configKey, {});
    }
    return config;
  }
  saveConfig() {
    this.saveField.forEach(item => {
      if (item.type == 'checkbox') {
        this.config[item.key] = document.getElementById(this.id + '_' + item.key).checked;
      } else if (item.type == 'list') {
        this.config[item.key] = this.extractList(this.id + '_' + item.key);
      }
    });
    Block_Obj.GM.setValue(this.configKey, this.config);
    typeof this.onSave === 'function' && this.onSave(this.getConfig());
  }
  createSettingsPanel() {
    this.wrapDiv = document.createElement('div');
    this.wrapDiv.id = this.id + '_wrapDiv';
    this.wrapDiv.className = 'block_obj_wrap_div ' + (this.display ? 'block_obj_show_wrap' : 'block_obj_hidden_wrap');
    this.mainFieldset = document.createElement('fieldset');
    this.mainFieldset.id = this.id + '_mainFieldset';
    this.mainFieldset.className = 'block_obj_main_fieldset';
    this.wrapDiv.appendChild(this.mainFieldset);
    this.ulNode = document.createElement('ul');
    this.ulNode.id = this.id + '_ulNode';
    this.ulNode.className = 'block_obj_ul_node';
    this.mainFieldset.appendChild(this.ulNode);
    document.body.appendChild(this.wrapDiv);
  }
  destroyAndRebuild(new_config = null) {
    this.config = new_config || this.config;
    document.body.removeChild(this.wrapDiv);
    this.createSettingsPanel();
    this.settingsPanel();
  }
  expandWrap() {
    const panel = document.getElementById(this.id + '_wrapDiv');
    if (panel) {
      if (panel.classList.contains('block_obj_show_wrap')) {
        this.display = false;
        panel.classList.remove('block_obj_show_wrap');
        panel.classList.add('block_obj_hidden_wrap');
      } else {
        this.display = true;
        panel.classList.remove('block_obj_hidden_wrap');
        panel.classList.add('block_obj_show_wrap');
      }
    }
  }
  insertCheckbox(id, label = '', title = '', checked = false, classname = null, moveRight = false) {
    const checkboxLi = document.createElement('li');
    checkboxLi.className = 'block_obj_checkbox_li';
    classname && checkboxLi.classList.add(classname);
    moveRight && checkboxLi.classList.add('block_obj_move_right');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.className = 'block_obj_checkbox_input';
    checkboxInput.id = this.id + '_' + id;
    checkboxInput.checked = checked ? true : false;
    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'block_obj_checkbox_label';
    checkboxLabel.setAttribute('for', this.id + '_' + id);
    checkboxLabel.textContent = label;
    checkboxLabel.title = title;
    checkboxLi.appendChild(checkboxInput);
    checkboxLi.appendChild(checkboxLabel);
    this.ulNode.appendChild(checkboxLi);
    this.saveField.push({
      key: id,
      type: 'checkbox',
    });
  }
  insertSeparator(id = null, label = null, title = null, liClassname = null) {
    const separatorLi = document.createElement('li');
    separatorLi.className = 'block_obj_separator_li';
    liClassname && separatorLi.classList.add('block_obj_' + liClassname);
    const separatorDiv = document.createElement('div');
    if (id) {
      separatorDiv.id = this.id + '_' + id;
    }
    if (label) {
      separatorDiv.className = 'block_obj_separator_text';
      separatorDiv.textContent = label;
    } else {
      separatorDiv.className = 'block_obj_separator_symbol';
    }
    separatorDiv.title = title ? title : '';
    separatorLi.appendChild(separatorDiv);
    this.ulNode.appendChild(separatorLi);
  }
  insertBr(classname = null) {
    const br = document.createElement('br');
    br.className = classname ? classname : '';
    this.ulNode.appendChild(br);
  }
  insertInput(listId, id = null, label = '', title = '', placeholder = '', liClassname = null, campare = null) {
    const inputLi = document.createElement('li');
    inputLi.className = liClassname ? 'block_obj_' + liClassname : '';
    const inputDiv = document.createElement('div');
    inputDiv.className = 'block_obj_input_div';
    const inputSpan = document.createElement('span');
    inputSpan.className = 'block_obj_input_span';
    inputSpan.textContent = label;
    inputDiv.appendChild(inputSpan);
    const input = document.createElement('input');
    if (id) {
      input.id = this.id + '_' + id;
    }
    input.title = title;
    input.placeholder = placeholder;
    input.type = 'text';
    input.className = 'block_obj_input block_obj_keyword_input';
    inputSpan.appendChild(input);
    const theListId = this.id + '_' + listId;
    input.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        this.addListItem(input, theListId, campare);
      }
    });
    const addBtn = this.createSpanBtn('block_obj_input_btn', '添加', '添加内容到列表中', _e => {
      if (this.addListItem(input, theListId, campare)) {
        this.buttonClicked(addBtn, '添加成功', 'block_obj_button_clicked');
      }
    });
    const deleteBtn = this.createSpanBtn('block_obj_input_btn', '删除', '从列表中删除符合的项目', _e => {
      if (this.delListItem(input, theListId)) {
        this.buttonClicked(deleteBtn, '删除成功', 'block_obj_button_clicked');
      }
    });
    const clearBtn = this.createSpanBtn('block_obj_input_btn', '清空', '清空列表', _e => {
      document.getElementById(theListId).innerHTML = '';
      this.buttonClicked(clearBtn, '清除成功', 'block_obj_button_clicked');
    });
    const copyBtn = this.createSpanBtn('block_obj_input_btn', '复制', '复制列表', _e => {
      Block_Obj.GM.setClipboard(this.extractList(theListId).toString());
      this.buttonClicked(copyBtn, '复制成功', 'block_obj_button_clicked');
    });
    const expandBtn = this.createSpanBtn('block_obj_input_btn', '展开', '展开列表', _e => {
      liClassname && this.toggleList('block_obj_' + liClassname);
      if (expandBtn.textContent == '展开') {
        expandBtn.textContent = '恢复';
        expandBtn.title = '收缩列表';
      } else {
        expandBtn.textContent = '展开';
        expandBtn.title = '展开列表';
      }
    });
    inputDiv.appendChild(addBtn);
    inputDiv.appendChild(deleteBtn);
    inputDiv.appendChild(clearBtn);
    inputDiv.appendChild(copyBtn);
    inputDiv.appendChild(expandBtn);
    inputLi.appendChild(inputDiv);
    this.ulNode.appendChild(inputLi);
  }
  insertList(id, saveArray = [], label = '', title = '', liClassname = '') {
    const listLi = document.createElement('li');
    listLi.className = liClassname ? 'block_obj_' + liClassname : '';
    const listDiv = document.createElement('div');
    listDiv.className = 'block_obj_list_div';
    listDiv.textContent = label;
    listDiv.title = title;
    const listTextareaDiv = document.createElement('div');
    listTextareaDiv.id = this.id + '_' + id;
    listTextareaDiv.className = 'block_obj_list_textarea_div';
    for (const item of saveArray) {
      item && listTextareaDiv.insertAdjacentElement('afterbegin', this.createListItem(item));
    }
    listDiv.appendChild(listTextareaDiv);
    listLi.appendChild(listDiv);
    this.ulNode.appendChild(listLi);
    this.saveField.push({
      key: id,
      type: 'list',
    });
  }
  addListItem(input, listId, campare = null) {
    const textValue = input.value;
    if (textValue) {
      const textArr = this.stringToArray(textValue);
      const saveArr = this.extractList(listId);
      textArr.forEach(item => {
        let status = true;
        if (typeof campare === 'function') {
          const tempStatus = campare(item);
          if (typeof tempStatus === 'boolean') {
            status = tempStatus;
          }
        }
        if (status) {
          !saveArr.includes(item) && document.getElementById(listId).insertAdjacentElement('afterbegin', this.createListItem(item));
        }
      });
      input.value = '';
      return true;
    }
    return false;
  }
  delListItem(input, listId) {
    const textValue = input.value;
    if (textValue) {
      let delStatus = false;
      const textArr = this.stringToArray(textValue);
      const saveArr = this.extractList(listId);
      textArr.forEach(item => {
        if (saveArr.includes(item)) {
          const totalChild = document.getElementById(listId).getElementsByClassName('block_obj_child_span');
          try {
            document.getElementById(listId).removeChild(totalChild[totalChild.length - 1 - saveArr.indexOf(item)]);
            delStatus = true;
          } catch (e) {
            delStatus = false;
            console.error('Block_Obj: Error deleting element.');
            console.error(e);
          }
        }
      });
      if (delStatus) {
        input.value = '';
        return true;
      }
    }
    return false;
  }
  createSpanBtn(classname, label, title, callback) {
    const btnSpan = this.createBasicBtn('span', label, title, classname);
    btnSpan.addEventListener('click', e => typeof callback === 'function' && callback(e));
    return btnSpan;
  }
  createListItem(text_value) {
    const childSpan = document.createElement('span');
    childSpan.className = 'block_obj_child_span';
    const textSpan = document.createElement('span');
    textSpan.className = text_value.match(/^\/.+\/[a-z]*$/i) ? 'block_obj_child_text block_obj_child_green' : 'block_obj_child_text';
    textSpan.textContent = text_value.length > 9 ? text_value.slice(0, 3) + ' ... ' + text_value.slice(-3) : text_value;
    if (text_value.length > 9) {
      textSpan.title = text_value;
    }
    const delSpan = document.createElement('span');
    delSpan.textContent = 'X';
    delSpan.title = '移除';
    delSpan.className = 'block_obj_child_del';
    delSpan.addEventListener('click', e => childSpan.remove());
    childSpan.appendChild(textSpan);
    childSpan.appendChild(delSpan);
    return childSpan;
  }
  createBasicBtn(type, text, title, classname) {
    let btnType = 'span';
    if (typeof type === 'string') {
      switch (type.toLowerCase()) {
        case 'div':
        case 'd':
          btnType = 'div';
          break;
        case 'a':
          btnType = 'a';
          break;
        case 'button':
          btnType = 'button';
          break;
        case 'input':
          btnType = 'input';
          break;
        case 'i':
          btnType = 'i';
          break;
        case 'b':
          btnType = 'b';
          break;
        case 'span':
        case 's':
        default:
          btnType = 'span';
          break;
      }
    }
    const btn = document.createElement(btnType);
    btn.textContent = text ? text : '';
    btn.title = title ? title : '';
    btn.className = classname ? classname : '';
    return btn;
  }
  createBlockBtn(value, listId, classname, type = 'span', text = '', title = '', campare = null) {
    const blockBtn = this.createBasicBtn(type, text, title, classname);
    blockBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (value && listId) {
        let status = true;
        if (typeof campare === 'function') {
          const tempStatus = campare(value);
          if (typeof tempStatus === 'boolean') {
            status = tempStatus;
          }
        }
        if (status) {
          const theListId = this.id + '_' + listId;
          const saveArr = this.extractList(theListId);
          !saveArr.includes(value) &&
            document.getElementById(theListId) &&
            document.getElementById(theListId).insertAdjacentElement('afterbegin', this.createListItem(value));
        }
      }
      this.saveConfig();
    });
    return blockBtn;
  }
  createBigBangBtn(value, listId, classname, type = 'span', text = '', title = '', campare = null) {
    const bigBangBtn = this.createBasicBtn(type, text, title, classname);
    bigBangBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (value && listId) {
        const theListId = this.id + '_' + listId;
        this.injectionBigBangPanel(value, theListId, campare);
      }
    });
    return bigBangBtn;
  }
  injectionBigBangPanel(value, listId, campare = null) {
    const presentationDiv = document.createElement('div');
    presentationDiv.id = this.id + '_presentationDiv';
    presentationDiv.className = 'block_obj_presentation_div';
    presentationDiv.addEventListener('click', function (event) {
      if (event.target === this) {
        if (presentationDiv) {
          presentationDiv.remove();
        }
      }
    });
    const dialogDiv = document.createElement('div');
    dialogDiv.className = 'block_obj_dialog_div';
    presentationDiv.appendChild(dialogDiv);
    const topPart = document.createElement('div');
    topPart.className = 'block_obj_big_bang_top_part';
    const h3 = document.createElement('h3');
    h3.className = 'block_obj_big_bang_h3';
    h3.textContent = '大爆炸';
    topPart.appendChild(h3);
    const deselectBtn = this.createSpanBtn('block_obj_big_bang_deselect_btn', '取消选择', '取消全部已选择的内容', e => {
      e.stopPropagation();
      const selectArr = document.querySelectorAll('.block_obj_big_bang_text_selected');
      for (const s of selectArr) {
        s.classList.remove('block_obj_big_bang_text_selected');
      }
    });
    topPart.appendChild(deselectBtn);
    const valueArray = value.replace(/\s|&nbsp;/gi, '').split('');
    const middlePart = document.createElement('div');
    middlePart.className = 'block_obj_big_bang_middle_part';
    const nodeArray = valueArray.map((ele, index) => {
      const eleNode = this.createBasicBtn('span', ele, '', 'block_obj_big_bang_text');
      eleNode.setAttribute('data-index', index);
      eleNode.addEventListener('click', e => {
        e.stopPropagation();
        eleNode.classList.contains('block_obj_big_bang_text_selected')
          ? eleNode.classList.remove('block_obj_big_bang_text_selected')
          : eleNode.classList.add('block_obj_big_bang_text_selected');
      });
      return eleNode;
    });
    nodeArray.forEach(item => {
      middlePart.appendChild(item);
    });
    const bottomPart = document.createElement('div');
    bottomPart.className = 'block_obj_big_bang_bottom_part';
    const addBtn = this.createSpanBtn('block_obj_big_bang_add_btn', '添加', '添加选择的内容到列表中', e => {
      e.stopPropagation();
      const textValue = this.getSelectedText('block_obj_big_bang_text_selected');
      if (textValue && listId) {
        const textArr = this.stringToArray(textValue);
        const saveArr = this.extractList(listId);
        textArr.forEach(item => {
          let status = true;
          if (typeof campare === 'function') {
            const tempStatus = campare(item);
            if (typeof tempStatus === 'boolean') {
              status = tempStatus;
            }
          }
          if (status) {
            !saveArr.includes(item) && document.getElementById(listId).insertAdjacentElement('afterbegin', this.createListItem(item));
          }
        });
        this.saveConfig();
        presentationDiv.remove();
      }
    });
    bottomPart.appendChild(addBtn);
    const copyBtn = this.createSpanBtn('block_obj_big_bang_copy_btn', '复制', '复制选择的内容到剪贴板中', e => {
      e.stopPropagation();
      const textValue = this.getSelectedText('block_obj_big_bang_text_selected');
      if (textValue) {
        Block_Obj.GM.setClipboard(textValue);
        presentationDiv.remove();
      }
    });
    bottomPart.appendChild(copyBtn);
    dialogDiv.appendChild(topPart);
    dialogDiv.appendChild(middlePart);
    dialogDiv.appendChild(bottomPart);
    document.body.appendChild(presentationDiv);
  }
  getSelectedText(classname) {
    const selectedArray = document.getElementsByClassName(classname);
    let lastIndex = -1;
    let textValue = '';
    for (const selected of selectedArray) {
      const index = selected.getAttribute('data-index') || -1;
      if (Number(index) == lastIndex + 1) {
        textValue += selected.textContent;
      } else {
        textValue = textValue ? textValue + ',' + selected.textContent : selected.textContent;
      }
      lastIndex = Number(index);
    }
    return textValue;
  }
  buttonClicked(button, clickTitle, click_class) {
    const originalTitle = button.title;
    button.title = clickTitle;
    click_class && button.classList.add(click_class);
    this.timer && window.clearTimeout(this.timer);
    this.timer = null;
    this.timer = window.setTimeout(() => {
      button.title = originalTitle;
      button.classList.remove(click_class);
    }, 1000);
  }
  extractList(listId) {
    const reArr = [];
    const listDom = document.getElementById(listId);
    const listArr = listDom.getElementsByClassName('block_obj_child_text');
    for (let i = listArr.length - 1; i >= 0; i--) {
      listArr[i].title ? reArr.push(listArr[i].title) : reArr.push(listArr[i].textContent);
    }
    return reArr;
  }
  stringToArray(textString = '') {
    const tempArray = textString.match(/^\/.+\/[a-z]*$/i) ? [textString] : textString.split(',');
    const returnArray = [];
    for (let i = 0, l = tempArray.length; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        if (tempArray[i] === tempArray[j]) {
          ++i;
          j = i;
        }
      }
      returnArray.push(tempArray[i]);
    }
    return returnArray;
  }
  toggleList(liClassname) {
    for (const li of this.ulNode.querySelectorAll('li')) {
      if (li.classList.contains(liClassname)) {
        const listTextareaDiv = li.querySelector('.block_obj_list_textarea_div');
        if (listTextareaDiv) {
          listTextareaDiv.classList.contains('block_obj_list_textarea_expand')
            ? listTextareaDiv.classList.remove('block_obj_list_textarea_expand')
            : listTextareaDiv.classList.add('block_obj_list_textarea_expand');
        }
      } else {
        li.classList.contains('block_obj_li_hide') ? li.classList.remove('block_obj_li_hide') : li.classList.add('block_obj_li_hide');
      }
    }
    for (const br of this.ulNode.querySelectorAll('br')) {
      br.classList.contains('block_obj_li_hide') ? br.classList.remove('block_obj_li_hide') : br.classList.add('block_obj_li_hide');
    }
  }
  convertArray(stringArray) {
    const reArr = [];
    if (Array.isArray(stringArray)) {
      for (const str of stringArray) {
        if (str.match(/^\/.+\/[a-z]*$/i)) {
          try {
            const newReg = new RegExp(str.replace(/^\/|\/[a-z]*$/gi, ''), str.replace(/^\/.*\/[^a-z]*/i, ''));
            reArr.push(newReg);
          } catch (e) {
            console.error('Block_Obj: The transformation contains invalid regular expressions.');
            console.error(e);
          }
        } else {
          reArr.push(str);
        }
      }
    }
    return reArr;
  }
}
Block_Obj.count = 0;
Block_Obj.GM = {
  isError: false,
  menuCount: 0,
  error: message => {
    if (!Block_Obj.GM.isError) {
      Block_Obj.GM.isError = true;
      alert('The required ' + message + ' method is incomplete!!!');
    }
  },
  warn: message => {
    console.warn('The required ' + message + ' method is incomplete!!!');
  },
  tips: message => {
    console.info('Tips: ' + message);
  },
  info: () => {
    if (typeof GM_info === 'object') {
      return GM_info;
    } else if (typeof GM.info === 'object') {
      return GM.info;
    } else {
      Block_Obj.GM.warn('GM_info or GM.info');
      return {
        script: {
          version: 0,
        },
        scriptHandler: 'Unknown',
        version: 0,
      };
    }
  },
  getValue: (name, defaultValue) => {
    if (typeof GM_getValue === 'function') {
      return GM_getValue(name, defaultValue);
    } else if (typeof GM.getValue === 'function') {
      return GM.getValue(name, defaultValue);
    } else {
      Block_Obj.GM.error('GM_getValue or GM.getValue');
      return null;
    }
  },
  setValue: (name, value) => {
    if (typeof GM_setValue === 'function') {
      GM_setValue(name, value);
    } else if (typeof GM.setValue === 'function') {
      GM.setValue(name, value);
    } else {
      Block_Obj.GM.error('GM_setValue or GM.setValue');
    }
  },
  deleteValue: async name => {
    if (typeof GM_deleteValue === 'function') {
      await GM_deleteValue(name);
    } else if (typeof GM.deleteValue === 'function') {
      await GM.deleteValue(name);
    } else {
      Block_Obj.GM.error('GM_deleteValue or GM.deleteValue');
    }
  },
  listValues: () => {
    if (typeof GM_listValues === 'function') {
      return GM_listValues();
    } else if (typeof GM.listValues === 'function') {
      return GM.listValues();
    } else {
      Block_Obj.GM.error('GM_listValues or GM.listValues');
    }
  },
  openInTab: (url, options) => {
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, options);
    } else if (typeof GM.openItTab === 'function') {
      GM.openInTab(url, options.active);
    } else {
      Block_Obj.GM.error('GM_openInTab or GM.openInTab');
    }
  },
  hasOpenIntTabMethods: () => {
    return typeof GM_openInTab === 'function' || typeof GM.openItTab === 'function';
  },
  hasRegisterMenuCommandMethods: () => {
    return typeof GM_registerMenuCommand === 'function';
  },
  hasAddValueChangeListenerMethods: () => {
    return typeof GM_addValueChangeListener === 'function';
  },
  registerMenuCommand: (name, fn) => {
    let menuId = null;
    if (typeof GM_registerMenuCommand === 'function') {
      if (Block_Obj.GM.info().scriptHandler === 'Violentmonkey') {
        Block_Obj.GM.menuCount++;
        GM_registerMenuCommand(Block_Obj.GM.menuCount + '.' + name, fn);
        menuId = Block_Obj.GM.menuCount + '.' + name;
      } else if (Block_Obj.GM.info().scriptHandler === 'Tampermonkey') {
        menuId = GM_registerMenuCommand(name, fn);
      }
    } else {
      Block_Obj.GM.warn('GM_registerMenuCommand');
    }
    return menuId;
  },
  unregisterMenuCommand: menuId => {
    if (typeof GM_unregisterMenuCommand === 'function') {
      GM_unregisterMenuCommand(menuId);
      if (Block_Obj.GM.info().scriptHandler === 'Violentmonkey') {
        Block_Obj.GM.menuCount--;
        if (Block_Obj.fn.compare('2.12.5', Block_Obj.GM.info().version)) {
          Block_Obj.GM.tips('Maybe you should update Violentmonkey to 2.12.5 or higher.');
        }
      }
    } else {
      Block_Obj.GM.warn('GM_unregisterMenuCommand');
    }
  },
  addValueChangeListener: (name, callback) => {
    if (typeof GM_addValueChangeListener === 'function') {
      return GM_addValueChangeListener(name, callback);
    } else {
      Block_Obj.GM.warn('GM_addValueChangeListener');
      return null;
    }
  },
  removeValueChangeListener: listenerId => {
    if (typeof GM_removeValueChangeListener === 'function') {
      GM_removeValueChangeListener(listenerId);
    } else {
      Block_Obj.GM.warn('GM_removeValueChangeListener');
    }
  },
  setClipboard: text => {
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(text);
    } else if (typeof GM.setClipboard === 'function') {
      GM.setClipboard(text);
    } else {
      Block_Obj.GM.error('GM_setClipboard or GM.setClipboard');
    }
  },
};
Block_Obj.fn = {
  hideOperation: (node, hide_status, method = 0) => {
    if (node && node instanceof HTMLElement) {
      if (hide_status) {
        if (method === 0) {
          node.classList.add('block_obj_none');
        } else if (method === 1) {
          node.classList.add('block_obj_hidden');
        } else if (method === 2) {
          node.style.display = 'none';
        } else if (method === 3) {
          node.style.visibility = 'hidden';
        }
      } else {
        if (method === 0) {
          node.classList.remove('block_obj_none');
        } else if (method === 1) {
          node.classList.remove('block_obj_hidden');
        } else if (method === 2) {
          node.style.display = '';
        } else if (method === 3) {
          node.style.visibility = '';
        }
      }
    }
  },
  compare(str1, str2, symbol = '.', equal = false) {
    const arr1 = str1.split(symbol);
    const arr2 = str2.split(symbol);
    let compareStatus = false;
    const len = arr1.length < arr2.length ? arr1.length : arr2.length;
    for (let i = len - 1; i >= 0; i--) {
      if (Number(arr1[i]) > Number(arr2[i])) {
        compareStatus = true;
      } else if (equal && Number(arr1[i]) == Number(arr2[i])) {
        compareStatus = true;
      } else {
        compareStatus = false;
      }
    }
    return compareStatus;
  },
  getVersion: () => '3.0.3',
};
