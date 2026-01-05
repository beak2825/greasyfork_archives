// ==UserScript==
// @name        JIRA templates
// @namespace   devsandbox.nfshost.com
// @description Allows saving JIRA issue descriptions and comments for reuse.
// @include     *.atlassian.net/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1300/JIRA%20templates.user.js
// @updateURL https://update.greasyfork.org/scripts/1300/JIRA%20templates.meta.js
// ==/UserScript==
var modifyEditor = function(editor) {
    if (editor.classList.contains('templatized')) {return;}
    var textarea = editor.querySelector('textarea');
    var child = document.createElement('div');
    var templates_key = 'templates-'+editor.id;
    
    var select = document.createElement('select');
    child.appendChild(select);
    var templates = localStorage.getItem(templates_key) || '[]';
    templates = JSON.parse(templates);
    renderTemplates(select, templates);
    
    var apply = document.createElement('input');
    apply.type = 'button';
    apply.value = 'Apply';
    apply.addEventListener('click', function() {
        var name = select.value;
        var content = localStorage.getItem(templates_key+'-'+name);
        textarea.value = content;
    });
    child.appendChild(apply);
    
    var forget = document.createElement('input');
    forget.type = 'button';
    forget.value = 'Forget';
    forget.addEventListener('click', function() {
       var name = select.value;
       if (!name) {return;}
       if (!confirm('Are you sure you want to forget '+name+'?')) {return;}
       var index = templates.indexOf(name);
       templates.splice(index, 1);
       saveTemplates(templates_key, templates);
       renderTemplates(select, templates);
    });
    child.appendChild(forget);
    
    var create = document.createElement('input');
    create.type = 'button';
    create.value = 'Create';
    create.addEventListener('click', function() {
       var name = prompt('Template name:');
       var content = textarea.value;
       localStorage.setItem(templates_key+'-'+name, content);
       templates.push(name);
       saveTemplates(templates_key, templates);
       renderTemplates(select, templates);
    });
    child.appendChild(create);
        
    editor.appendChild(child);
    editor.classList.add('templatized');
};

var renderTemplates = function(select, templates) {
    select.innerHTML = '';
    templates.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });    
};

var saveTemplates = function(templatesKey, templates) {
    localStorage.setItem(templatesKey, JSON.stringify(templates));
};

var findEditors = function() {
    var editor;
    if (editor = document.getElementById('description-wiki-edit')) {
       modifyEditor(editor);
    }
    if (editor = document.getElementById('comment-wiki-edit')) {
       modifyEditor(editor);
    }
};

setInterval(findEditors, 500);