// ==UserScript==
// @name         宜搭组件+
// @namespace    https://*.aliwork.com/*
// @version      0.1
// @license      MIT
// @description  宜搭组件plus
// @author       You
// @match        https://*.aliwork.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliwork.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456648/%E5%AE%9C%E6%90%AD%E7%BB%84%E4%BB%B6%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/456648/%E5%AE%9C%E6%90%AD%E7%BB%84%E4%BB%B6%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    try {
        if (window.pageConfig.designerConfigs.formType == 'receipt') {
            window.pageConfig.designerConfigs.modules.trunk.shownComponentList = ['TextField', 'TextareaField', 'NumberField', 'RadioField', 'CheckboxField', 'RateField', 'SelectField', 'MultiSelectField', 'CascadeSelectField', 'DateField', 'CascadeDateField', 'ImageField', 'AttachmentField', 'EmployeeField', 'TableField', 'RichText', 'DepartmentSelectField', 'CountrySelectField', 'AddressField', 'EditorField', 'ColumnsLayout', 'PageSection', 'AssociationFormField', 'LocationField', 'DigitalSignatureField', 'CC_PG_ESignField', 'Layout', 'Div', 'TabsLayout', 'Text', 'Image', 'Icon', 'Link', 'LinkBlock', 'Button', 'MenuButton', 'Video', 'Dialog', 'TablePc', 'Html', 'Jsx', 'Slider', 'Balloon', 'Collapse', 'PageHeader', 'Drawer', 'BannerContainer', 'Iframe', 'Progress', 'Pagination', 'Search', 'Filter2', 'Menu', 'Tree', 'Timeline', 'Steps']
        } else if (window.pageConfig.designerConfigs.formType == 'process') {
            window.pageConfig.designerConfigs.modules.trunk.shownComponentList = ['TextField', 'TextareaField', 'NumberField', 'RadioField', 'CheckboxField', 'RateField', 'SelectField', 'MultiSelectField', 'CascadeSelectField', 'DateField', 'CascadeDateField', 'ImageField', 'AttachmentField', 'EmployeeField', 'TableField', 'RichText', 'DepartmentSelectField', 'CountrySelectField', 'AddressField', 'EditorField', 'ColumnsLayout', 'PageSection', 'AssociationFormField', 'LocationField', 'DigitalSignatureField', 'CC_PG_ESignField', 'Layout', 'Div', 'TabsLayout', 'Text', 'Image', 'Icon', 'Link', 'LinkBlock', 'Button', 'MenuButton', 'Video', 'Dialog', 'TablePc', 'Html', 'Jsx', 'Slider', 'Balloon', 'Collapse', 'PageHeader', 'Drawer', 'BannerContainer', 'Iframe', 'Progress', 'Pagination', 'Search', 'Filter2', 'Menu', 'Tree', 'Timeline', 'Steps']
        }
    } catch(e) {
    }
})();