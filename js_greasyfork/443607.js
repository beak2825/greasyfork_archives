// ==UserScript==
// @name         PropertyguruAssist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  one button click -> simplify propertyguru listing info for easily copy / paste
// @author       EnginePlus
// @match        https://*.propertyguru.com.sg/listing/*
// @match        https://*.commercialguru.com.sg/listing/*
// @match        https://*.propertyguru.com.my/property-listing/*
// @grant        none
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js?version=174357
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/443607/PropertyguruAssist.user.js
// @updateURL https://update.greasyfork.org/scripts/443607/PropertyguruAssist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getValueByLabel(items, label) {
    if (!Array.isArray(items)) return 'N.A.';
    let item = items.find(item => item.label === label || item.icon === label);
    return item ? item.value : 'N.A.';
  }

  function safe(fn, fallback = 'N.A.') {
    try {
      const val = fn();
      return (val !== undefined && val !== null && val !== '') ? val : fallback;
    } catch {
      return fallback;
    }
  }

  function isLoginRequired() {
    const buttons = Array.from(document.querySelectorAll('div.btn-content'));
    return buttons.some(el => el.textContent.trim().toLowerCase() === 'login');
  }

  function extractData() {
    const jsonData = safe(() => JSON.parse(document.getElementById('__NEXT_DATA__').textContent), {});
    const root = jsonData?.props?.pageProps?.pageData?.data;

    const metatableItems = safe(() => root.detailsData.metatable.items, []);

    return {
      url: window.location.href,
      propertyName: safe(() => root.listingData.localizedTitle),
      tenureType: getValueByLabel(metatableItems, 'calendar-days-o'),
      topYear: getValueByLabel(metatableItems, 'document-with-lines-o'),
      totalUnits: getValueByLabel(metatableItems, 'block-o'),
      bedNum: safe(() => root.listingData.bedrooms),
      bathNum: safe(() => root.listingData.bathrooms),
      floorSize: safe(() => root.listingData.floorArea),
      price: safe(() => root.propertyOverviewData.propertyInfo.price.amount),
      agentName: safe(() => root.contactAgentData.contactAgentCard.agentInfoProps.agent.name),
      phoneNumber: safe(() => root.listingData.agent.mobile || root.contactAgentData.contactAgentCard.contactActions?.[0]?.phoneNumber)
    };
  }

  function copyToClipboard(data, checkboxes, button) {
    const get = key => checkboxes[key]?.checked ? (data[key] || 'N.A.') : '';

    const mainInfo = get('propertyName') + ' [' + get('tenureType') + ' / ' + get('topYear') + ' / ' + get('totalUnits') + ']'
      + ', ' + get('bedNum') + ' Bed, ' + get('bathNum') + ' Bath, ' + get('floorSize') + ' sqft, ' + get('price');

    const agentInfo = get('agentName') + ' ' + get('phoneNumber');

    const clipboardText = data.url + '\t' + mainInfo + '\t' + agentInfo;

    navigator.clipboard.writeText(clipboardText).then(() => {
      if (button) {
        button.textContent = '已复制！';
        setTimeout(() => (button.textContent = '复制到剪贴板'), 2000);
      }
    });
  }

  // ✅ 构造 WhatsApp 链接函数
  function formatPhoneNumber(raw) {
    const phone = raw.replace(/\D/g, '');
    return phone.startsWith('65') ? phone : '65' + phone;
  }

  function buildWhatsAppLink(agentName, listingUrl, rawPhone) {
    const phone = formatPhoneNumber(rawPhone);
    const message = `Hi ${agentName}, My client would like to learn more about your listing: ${listingUrl}`;
    const encodedText = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  }

  function createPanel(data) {
    const groups = [
      { key: 'infoBlock', label: '房源基本信息', fields: ['propertyName', 'tenureType', 'topYear', 'totalUnits', 'bedNum', 'bathNum', 'floorSize', 'price'] },
      { key: 'agentBlock', label: '联系人信息', fields: ['agentName', 'phoneNumber'] }
    ];

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = '#fdfdfd';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '2px 2px 12px rgba(0,0,0,0.2)';
    panel.style.fontSize = '14px';
    panel.style.minWidth = '320px';
    panel.style.zIndex = 9999;
    panel.style.cursor = 'move';
    panel.setAttribute("id", "floatingPanel");

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '8px';
    header.style.backgroundColor = '#4A90E2';
    header.style.color = '#fff';
    header.style.borderTopLeftRadius = '8px';
    header.style.borderTopRightRadius = '8px';
    header.style.cursor = 'move';

    const titleText = document.createElement('span');
    titleText.textContent = 'v1.0 小助手提取信息';
    titleText.style.fontWeight = 'bold';
    header.appendChild(titleText);

// ✅ 最小化按钮
const toggleBtn = document.createElement('button');
toggleBtn.textContent = '最小化';
toggleBtn.style.marginLeft = 'auto';
toggleBtn.style.marginRight = '5px';
toggleBtn.style.fontSize = '12px';
toggleBtn.style.padding = '2px 6px';
toggleBtn.style.cursor = 'pointer';
toggleBtn.style.border = 'none';
toggleBtn.style.borderRadius = '4px';
toggleBtn.style.background = '#fff';
toggleBtn.style.color = '#4A90E2';

let isCollapsed = false;
toggleBtn.onclick = () => {
  isCollapsed = !isCollapsed;
  content.style.display = isCollapsed ? 'none' : 'block';
  toggleBtn.textContent = isCollapsed ? '展开' : '最小化';
};

header.appendChild(toggleBtn);

    if (isLoginRequired()) {
      const warn = document.createElement('span');
      warn.textContent = '未登录无法显示电话号码';
      warn.style.color = 'red';
      warn.style.fontWeight = 'normal';
      warn.style.fontSize = '12px';
      warn.style.marginLeft = '10px';
      header.appendChild(warn);
    }

    panel.appendChild(header);

    const content = document.createElement('div');
    content.style.padding = '10px';
    content.style.backgroundColor = '#ffffff';
    const checkboxes = {};

    groups.forEach(group => {
      const title = document.createElement('div');
      title.textContent = group.label;
      title.style.fontWeight = 'bold';
      title.style.marginTop = '10px';
      content.appendChild(title);

      group.fields.forEach(key => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '4px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = key;
        checkboxes[key] = checkbox;

        const label = document.createElement('label');
        label.htmlFor = key;
        label.textContent = ' ' + key + ': ';

        const valueSpan = document.createElement('span');
        valueSpan.style.color = '#333';
        valueSpan.textContent = data[key] || 'N.A.';

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        wrapper.appendChild(valueSpan);
        content.appendChild(wrapper);
      });
    });

    const button = document.createElement('button');
    button.textContent = '复制到剪贴板';
    button.style.padding = '5px 10px';
    button.style.fontSize = '13px';
    button.style.cursor = 'pointer';
    button.onclick = () => copyToClipboard(data, checkboxes, button);

    const buttonGroup = document.createElement('div');
    buttonGroup.style.marginTop = '10px';
    buttonGroup.appendChild(button);

    // ✅ 增加带文本的 WhatsApp 联系按钮
    if (data.phoneNumber && data.phoneNumber !== 'N.A.') {
      const whatsappBtn = document.createElement('button');
      whatsappBtn.textContent = 'WhatsApp联系中介';
      whatsappBtn.style.marginLeft = '10px';
      whatsappBtn.style.padding = '5px 10px';
      whatsappBtn.style.fontSize = '13px';
      whatsappBtn.style.cursor = 'pointer';

      whatsappBtn.onclick = () => {
        const url = buildWhatsAppLink(data.agentName, data.url, data.phoneNumber);
        window.open(url, '_blank');
      };

      buttonGroup.appendChild(whatsappBtn);
    }

    content.appendChild(buttonGroup);
    panel.appendChild(content);
    document.body.appendChild(panel);

    makeDraggable(panel, header);
    copyToClipboard(data, checkboxes, button);
  }

  function makeDraggable(panel, handle) {
    let isDragging = false;
    let offsetX, offsetY;

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      panel.style.cursor = 'move';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
      const data = extractData();
      createPanel(data);
    });
  } else {
    const data = extractData();
    createPanel(data);
  }
})();
