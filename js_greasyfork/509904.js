// ==UserScript==
// @name         Symfony 翻译脚本安装链接
// @namespace    fireloong
// @version      0.0.5
// @description  翻译脚本安装链接
// @author       Itsky71
// @match        https://symfony.com/doc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509904/Symfony%20%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC%E5%AE%89%E8%A3%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/509904/Symfony%20%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC%E5%AE%89%E8%A3%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const urlParts = new URL(window.location.href);
    const pattern = /^\/doc\/(5.x|6.4|7.1|7.2|current)\/([\w\/]+).html$/;
    const page = pattern.exec(urlParts.pathname)[2];
    const doc_links = {
        "templates": "488393",
        "index": "488822",
        "setup": "494049",
        "page_creation": "494276",
        "routing": "494559",
        "controller": "496283",
        "configuration": "496285",
        "components/http_kernel": "496286",
        "reference/configuration/kernel": "496287",
        "service_container": "496288",
        "event_dispatcher": "496306",
        "components/contracts": "496308",
        "bundles": "496310",
        "doctrine": "496324",
        "forms": "496325",
        "testing": "496327",
        "session": "496329",
        "cache": "496330",
        "logging": "496332",
        "controller/error_pages": "496362",
        "console": "496363",
        "mailer": "496365",
        "validation": "496367",
        "messenger": "496368",
        "scheduler": "496369",
        "notifier": "496370",
        "serializer": "496426",
        "translation": "496427",
        "security": "496428",
        "security/passwords": "496429",
        "security/csrf": "496430",
        "security/ldap": "496431",
        "frontend": "496432",
        "frontend/encore/simple-example": "496478",
        "web_link": "496479",
        "http_client": "496481",
        "components/filesystem": "496482",
        "components/expression_language": "496483",
        "components/lock": "496516",
        "workflow": "496614",
        "components/string": "496615",
        "components/uid": "496620",
        "components/yaml": "496621",
        "webhook": "496622",
        "deployment": "496623",
        "performance": "496624",
        "http_cache": "496625",
        "controller/forwarding": "500745",
        "controller/service": "500796",
        "controller/upload_file": "500825",
        "controller/value_resolver": "500900",
        "routing/custom_route_loader": "501273",
        "setup/docker": "504228",
        "setup/homestead": "504231",
        "setup/web_server_configuration": "504331",
        "setup/bundles": "504343",
        "introduction/from_flat_php_to_symfony": "504408",
        "setup/file_permissions": "504453",
        "setup/flex": "504487",
        "setup/flex_private_recipes": "504511",
        "setup/symfony_server": "504612",
        "setup/unstable_versions": "504908",
        "configuration/env_var_processors": "504950",
        "configuration/front_controllers_and_kernel": "505013",
        "configuration/micro_kernel_trait": "505311",
        "configuration/multiple_kernels": "505473",
        "configuration/override_dir_structure": "506022",
        "configuration/secrets": "506267",
        "configuration/using_parameters_in_dic": "506892",
        "service_container/alias_private": "507587",
        "service_container/autowiring": "507816",
        "service_container/calls": "508396",
        "service_container/compiler_passes": "508461",
        "service_container/configurators": "508468",
        "bundles/override": "508701",
        "service_container/debug": "509069",
        "service_container/definitions": "509072",
        "service_container/expression_language": "509329",
        "service_container/factories": "509402",
        "service_container/import": "509656",
        "service_container/injection_types": "509657",
        "service_container/lazy_services": "509659",
        "service_container/optional_dependencies": "509660",
        "service_container/parent_services": "509663",
        "service_container/request": "509665",
        "service_container/service_closures": "509666",
        "service_container/service_decoration": "509667",
        "service_container/service_subscribers_locators": "509668",
        "service_container/shared": "509713",
        "service_container/synthetic_services": "509714",
        "service_container/tags": "509854",
        "bundles/best_practices": "510159"
    };

    const url = doc_links[page] ? 'https://greasyfork.org/scripts/'+doc_links[page] : 'https://greasyfork.org/zh-CN/script_versions/new?type=symfony&page='+page;

    $('body').append('<div id="add_on"><a id="translate_link" href="'+url+'" target="_blank">翻译脚本</a><div>');
})($);
