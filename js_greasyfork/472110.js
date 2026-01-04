// ==UserScript==
// @name         Harness bot
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  make harness better
// @author       cloud.he
// @match        https://app.harness.io/*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472110/Harness%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/472110/Harness%20bot.meta.js
// ==/UserScript==

/**
 * How to use
 * 1. download extension from https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?utm_source=ext_sidebar&hl=en-US
 * 2. download harness bot from https://greasyfork.org/en/scripts/472110-harness-bot
 * 3. edit argsByEnv object in harness bot script
 * 4. reload harness page
 * 5. input version like 0.0.666
 */

(function() {
  'use strict';
  const argsByEnv ={
    // for deploy services to test
    'test':{
      configRepoBranch:'master',
      dryRun:'false',
      verify:'false',
      gchat:'',
      environments:[''],
      servicesName:['']
    },
    // for deploy services to prod
    'prod':{
      configRepoBranch:'master',
      dryRun:'false',
      verify:'false',
      gchat:'',
      environments:[''],
      servicesName:['']
    },
    // for deploy services to preprod
    'preprod':{
      configRepoBranch:'master',
      dryRun:'false',
      verify:'false',
      gchat:'',
      environments:[''],
      servicesName:['']
    }
  }
  let version = '';
  let pipelineEnv = '';
  const simulateKeyPress = (keyCode) => {
    const eventParams = {
      key: String.fromCharCode(keyCode),
      keyCode: keyCode,
      which: keyCode,
      code: keyCode === 46 ? 'Period' : `Digit${keyCode - 48}`, // For dot (46) and digits 0-9
      charCode: keyCode,
      repeat: false,
      bubbles: true,
      cancelable: true,
      composed: true,
    };
    const event = new KeyboardEvent('keypress', eventParams);
    document.dispatchEvent(event);
  }
  const setNativeValue = (element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }
  const fillValue = () =>{
    const configRepoBranchInput = document.getElementsByName("template.templateInputs.stages[0].stage.variables[0].value")[1];
    setNativeValue(configRepoBranchInput,argsByEnv[pipelineEnv].configRepoBranch);
    configRepoBranchInput.dispatchEvent(new Event('input', { bubbles: true }));
    const dryRunInput = document.getElementsByName("template.templateInputs.stages[0].stage.variables[1].value")[1];
    setNativeValue(dryRunInput,argsByEnv[pipelineEnv].dryRun);
    dryRunInput.dispatchEvent(new Event('input', { bubbles: true }));
    const verifyInput = document.getElementsByName("template.templateInputs.stages[0].stage.variables[2].value")[1];
    setNativeValue(verifyInput,argsByEnv[pipelineEnv].verify);
    verifyInput.dispatchEvent(new Event('input', { bubbles: true }));
    const gchatInput = document.getElementsByName("template.templateInputs.stages[0].stage.variables[4].value")[1];
    setNativeValue(gchatInput,argsByEnv[pipelineEnv].gchat);
    gchatInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector("[data-testid=multi-select-dropdown-button]").click();
    const runMultiSelectCheck = setInterval(()=>{
      if(document.getElementsByClassName('bp3-popover bp3-minimal MultiSelectDropDown--popover').length>0){
        argsByEnv[pipelineEnv].environments.forEach(env => Array.from(document.getElementsByTagName('label')).forEach(select => {
          if(select.innerHTML.includes(env) && !select.className.includes('MultiSelectDropDown--active')){
            select.click()
          }
        }));
        document.getElementsByClassName('bp3-overlay-backdrop bp3-popover-backdrop bp3-popover-enter-done')[0].click();
        clearInterval(runMultiSelectCheck);
      }
    },500)

    document.getElementsByClassName("StyledProps--font StyledProps--main bp3-input QsSxrd u1WpZT StyledProps--border StyledProps--padding-xsmall")[0].firstChild.firstChild.click();
    const runServicesCheck = setInterval(()=>{
      if(document.getElementsByClassName('Collapse--main').length > 0){
        argsByEnv[pipelineEnv].servicesName.forEach(serviceName => {
          Array.from(document.getElementsByClassName('Collapse--main')).filter(
            service => serviceName === service.innerText.split('Id: ')[1]
          ).forEach(selectService => {
            // skip if has been checked
            selectService.classList.length===2 && selectService.firstChild.firstChild.children[1].firstChild.click();
          });
        });
        document.querySelector('[aria-label="Apply Selected"]').click();
        clearInterval(runServicesCheck);
        const runVersionInputCheck = setInterval(()=>{
          if(document.getElementsByName('template.templateInputs.stages[0].stage.spec.services.values[0].serviceInputs.serviceDefinition.spec.manifests[0].manifest.spec.chartVersion').length > 1){
            const versionInput = document.getElementsByName('template.templateInputs.stages[0].stage.spec.services.values[0].serviceInputs.serviceDefinition.spec.manifests[0].manifest.spec.chartVersion')[1];
            versionInput.focus();
            for (let i = 0; i < version.length; i++) {
              const keyCode = version.charCodeAt(i);
              simulateKeyPress(keyCode);
              versionInput.value += [...version][i];
              setNativeValue(versionInput,version);
              versionInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            document.getElementsByClassName('bp3-button bp3-minimal Button--button StyledProps--font StyledProps--main Select--createNewItemButton StyledProps--intent-primary Button--with-current-color Button--without-shadow Button--withLeftIcon')[0].click();
            clearInterval(runVersionInputCheck);
          }
        },1000)
      }
    },500)
  }
  let harnessBot = () => {
    const run = (url) => {
      const runButtonCheck = setInterval(()=>{
        if(document.querySelector('[data-testid="card-run-pipeline"]')){
          document.querySelector('[data-testid="card-run-pipeline"]').addEventListener("click", ()=>{
            const runInputCheck = setInterval(()=>{
              if(document.getElementsByName("template.templateInputs.stages[0].stage.variables[0].value").length > 0
                && document.getElementsByName("template.templateInputs.stages[0].stage.variables[1].value").length > 0
                && document.getElementsByName("template.templateInputs.stages[0].stage.variables[2].value").length > 0
              ){
                if(!document.getElementById('iherb-fill-container')){
                  const fillContainer = document.createElement("div");
                  fillContainer.setAttribute('id','iherb-fill-container');
                  document.getElementsByClassName('customVariables')[1].prepend(fillContainer);
                  document.getElementById('iherb-fill-container').setAttribute('style','display:block;')

                  const fillButton = document.createElement("button");
                  fillButton.innerHTML="AutoFill";
                  fillButton.setAttribute('id','iherb-fill-btn');
                  fillButton.setAttribute('style','margin-left: 16px;');
                  fillButton.classList.add('bp3-button', 'Button--button', 'StyledProps--font', 'StyledProps--main', 'StyledProps--intent-success', 'Button--with-current-color', 'Button--variation', 'Button--variation-primary')
                  fillContainer.prepend(fillButton);
                  fillButton.addEventListener("click", (e)=>{
                    e.preventDefault();
                    version = document.getElementById('iherb-fill-input').value.trim();
                    if(version !== ''){
                      fillValue();
                    }else{
                      document.getElementById('iherb-fill-input').value='wrong version';
                    }
                  });
                  const fillInput = document.createElement("input");
                  fillInput.setAttribute('id','iherb-fill-input');
                  fillInput.setAttribute('type','text');
                  fillInput.setAttribute('placeholder','version e.g.: 0.0.1');
                  fillInput.setAttribute('style','height:32px; width: 120px;');
                  fillInput.setAttribute('name','template.templateInputs.stages[0].stage.spec.services.values[0].serviceInputs.serviceDefinition.spec.manifests[0].manifest.spec.chartVersion');
                  fillContainer.prepend(fillInput);
                  if(window.location.pathname.includes('to_test')){
                    pipelineEnv='test'
                  }else if(window.location.pathname.includes('to_prod')){
                    pipelineEnv='prod'
                  }else if(window.location.pathname.includes('to_preprod')){
                    pipelineEnv='preprod'
                  }else{
                    pipelineEnv='test'
                  }
                }
                clearInterval(runInputCheck);
              }
            },500)
          });
          clearInterval(runButtonCheck);
        }
      },500)
    };
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;
    window.history.pushState = function(state, unused, url) {
      run(url);
      pushState.apply(this, arguments);
    };
    window.history.replaceState = function(state, unused, url) {
      run(url);
      replaceState.apply(this, arguments);
    };
    run(window.location.href);
  }
  harnessBot();
})();