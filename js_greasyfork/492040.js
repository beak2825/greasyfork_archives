// ==UserScript==
// @name         Arsenal Mania thread delay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a thread delay to the Arsenal Mania forum
// @author       lufere7
// @match        https://arsenal-mania.com/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492040/Arsenal%20Mania%20thread%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/492040/Arsenal%20Mania%20thread%20delay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const colors = {
      navy: 'rgb(32, 43, 54)',
      borderGray: 'rgb(127, 127, 127)',
      darkRed: 'rgb(136, 0, 0)',
      gray: 'rgb(148, 148, 148)',
      white: 'rgb(253, 253, 253)',
    }
    
    const styles = {
      container: `
        display: flex;
        align-items: center;
      `,
      inputsContainer: `
        margin-left: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${colors.gray};
        padding: 4px 12px;
        border-radius: 4px;
        min-height: 34px;
        
      `,
      wrapper: `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `,
      input: `
        width: 60px;
        background-color: ${colors.navy};
        color: ${colors.white};
        border: 1px solid ${colors.borderGray};
        border-radius: 4px;
        padding-left: 8px;
      `,
      label: `
        color: ${colors.navy};
        font-weight: bold;
        font-size: 12px;
        margin-bottom: -2px;
      `,
      secondWrapper: `
        display: flex;
        flex-direction: column;
      `,
      setDelayButton: `
        border: 1px solid ${colors.borderGray};
        background-color: ${colors.darkRed};
        color: ${colors.white};
        border-radius: 6px;
        cursor: pointer;
        padding: 8px 10px;
        font-size: 13px;
        font-family: Helvetica, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      `,
      banner: `
        border: 2px solid black;
        width: 100%;
        height: 30px;
        background-color: goldenrod;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      `,
      enabledCheckbox: `
        margin-right: 8px;
        margin-top: 4px;
        accent-color: ${colors.darkRed};
      `,
      hideableWrapper: `
        display: flex;
        margin-left: 8px;
      `,
    }
    
    let globalTimeout;
    
    const hidePosts = (delay) => {
      const isEnabled = document.getElementById('enabled').checked;
      const hiddenPosts = []
      const postsArray = Array.from(document.querySelectorAll('article.message'))
      const currentDate = Date.now()/1000
      clearTimeout(globalTimeout)
      postsArray.forEach((post) => {
          const postDate = Number(post.querySelector('.u-dt').getAttribute('data-time'))
          const secondsAgo = currentDate - postDate
          if(secondsAgo < delay){
            post.style.transition = 'opacity 0s'
            post.style.opacity = 0
            post.style.border = '1px solid goldenrod'
              if(!hiddenPosts.length) {
                  const secondsUntilPost = delay - secondsAgo
                  globalTimeout = setTimeout(() => {
                      hidePosts(delay)
                  }, secondsUntilPost*1000);
              }
              hiddenPosts.push(post)
          } else {
            post.style.opacity = 1
            post.style.transition = 'opacity 2s'
            if(!isEnabled) post.style.border = `1px solid ${colors.borderGray}`
          }
      })
      removeBanner()
      if(!hiddenPosts.length && isEnabled) appendBanner()
    
    }
    
    const initialCheck = () => {
      const storedMinutes = localStorage.getItem('delayMinutes')
      const storedSeconds = localStorage.getItem('delaySeconds')
      const enabled = localStorage.getItem('enabled')
      const isEnabled = JSON.parse(enabled)
      toggleVisibility(isEnabled)
      if(storedMinutes || storedSeconds) {
          let storedTime = 0
          if(storedMinutes) {
              storedTime += Number(storedMinutes)*60
              const minuteInput = document.getElementById('minuteInput')
              minuteInput.value = Number(storedMinutes);
          }
          if(storedSeconds) {
              storedTime += Number(storedSeconds)
              const secondInput = document.getElementById('secondInput')
              secondInput.value = Number(storedSeconds);
          }
          if(isEnabled) {
            const checkbox = document.getElementById('enabled');
            checkbox.checked = true;
            hidePosts(storedTime)
          }
      }
    }
    
    const onSubmit = () => {
      const isEnabled = document.getElementById('enabled').checked;
      const minuteInput = document.querySelector('#minuteInput').value
      const secondInput = document.querySelector('#secondInput').value
      const minutes = Number(minuteInput)
      const seconds = Number(secondInput)
      localStorage.setItem('delayMinutes', minuteInput)
      localStorage.setItem('delaySeconds', secondInput)
      const totalDelay = (minutes*60)+seconds
      if(isEnabled)hidePosts(totalDelay)
    }
    
    
    const onEnable = (event) => {
      const isEnabled = event.target.checked
      localStorage.setItem('enabled', isEnabled)
      const inputsExist = document.getElementById('setDelayButton')
      if(isEnabled) {
        toggleVisibility(true)
        onSubmit()
      }else{
        hidePosts(0)
        toggleVisibility(false)
      }
    }
    
    const appendBanner = () => {
      const postContainer = document.querySelector('#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div > div.p-body-content > div.p-body-pageContent > div.block.block--messages > div.block-container.lbContainer')
      const banner = document.createElement('div')
      banner.style.cssText = styles.banner;
      banner.innerHTML='No more hidden posts'
      banner.setAttribute('id', 'banner');
      postContainer.append(banner)
    }
    
    const removeBanner = () => {
      const banner = document.getElementById('banner')
      if(banner)banner.remove()
    }
    
    const toggleVisibility = (enabled) => {
      const hideableWrapper = document.getElementById('hideableWrapper')
      hideableWrapper.style.display = enabled ? 'flex' : 'none';
    }
    
    const createInputs = () => {
      const container = document.querySelector('#top > div.xb-page-wrapper.xb-canvas-menuActive > div.xb-content-wrapper > div.p-body > div > div > div.p-body-content > div.p-body-pageContent > div.block.block--messages > div.block-outer.block-outer--after > div.block-outer-main')
      container.style.cssText = styles.container;
      const inputsContainer = document.createElement('div')
      inputsContainer.style.cssText = styles.inputsContainer;
    
      const enabledWrapper = document.createElement('div');
      enabledWrapper.style.cssText = styles.wrapper;
      const enabledCheckbox = document.createElement('input');
      enabledCheckbox.setAttribute('label', 'enabled');
      enabledCheckbox.setAttribute('type', 'checkbox');
      const enabledLabel = document.createElement('label')
      enabledLabel.textContent = 'Enable'
      enabledLabel.style.cssText = styles.label;
      enabledCheckbox.style.cssText = styles.enabledCheckbox;
      enabledCheckbox.setAttribute('id', 'enabled');
      enabledCheckbox.addEventListener('click', onEnable)
      enabledWrapper.append(enabledLabel, enabledCheckbox)
    
      const minuteWrapper = document.createElement('div');
      minuteWrapper.setAttribute('id', 'minuteWrapper')
      minuteWrapper.style.cssText = styles.wrapper;
      const minuteLabel = document.createElement('label');
      minuteLabel.style.cssText = styles.label;
      minuteLabel.textContent = 'Minutes'
    
      const minuteInput = document.createElement('input');
      minuteInput.setAttribute('label', 'minutes');
      minuteInput.setAttribute('type', 'number');
      minuteInput.setAttribute('id', 'minuteInput');
      minuteInput.style.cssText = styles.input;
      minuteWrapper.append(minuteLabel, minuteInput)
    
      const secondWrapper = document.createElement('div');
      secondWrapper.setAttribute('id', 'secondWrapper')
      secondWrapper.style.cssText = styles.wrapper;
      const secondLabel = document.createElement('label');
      secondLabel.textContent = 'Seconds'
      secondLabel.style.cssText = styles.label;
    
      const secondInput = document.createElement('input');
      secondInput.setAttribute('label', 'seconds');
      secondInput.setAttribute('type', 'number');
      secondInput.setAttribute('id', 'secondInput');
      secondInput.style.cssText = styles.input;
      secondWrapper.append(secondLabel, secondInput)
    
      const setDelayButton = document.createElement('button');
      setDelayButton.setAttribute('id', 'setDelayButton')
      setDelayButton.textContent = 'Set delay'
      setDelayButton.addEventListener('click', onSubmit)
      setDelayButton.style.cssText = styles.setDelayButton;
      const hideableWrapper = document.createElement('div')
      hideableWrapper.setAttribute('id', 'hideableWrapper');
      hideableWrapper.style.cssText = styles.hideableWrapper;
      hideableWrapper.append(minuteWrapper, secondWrapper, setDelayButton)
      inputsContainer.append(enabledWrapper, hideableWrapper)
      container.append(inputsContainer)
    }
    
    
    createInputs()
    initialCheck()

})();