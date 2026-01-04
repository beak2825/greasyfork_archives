// ==UserScript==
// @name         GitHub - Pull Request - Add Atlantis buttons
// @namespace    https://greasyfork.org/en/scripts?by=1388261
// @version      1.2
// @description  Add Atlantis buttons to the footer of your Pull Request
// @author       You
// @match        https://github.com/*/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @tag          productivity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514717/GitHub%20-%20Pull%20Request%20-%20Add%20Atlantis%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/514717/GitHub%20-%20Pull%20Request%20-%20Add%20Atlantis%20buttons.meta.js
// ==/UserScript==
(() => {
    'use strict';

    let interval

    const addElements = () => {
        var ctas = document.querySelector('#partial-new-comment-form-actions')

        document.body.querySelectorAll('div[x-data-n8="true"]')?.forEach((el) => ctas.removeChild(el))

        var container = document.createElement('div')

        container.setAttribute('x-data-n8', true)
        container.classList.add(...'d-flex'.split(' '))
        container.style.justifyContent = 'start !important'
        ctas.prepend(container)

        const toggle = createToggle()

        toggle.addEventListener('change', (e) => {
          const actionText = toggle.checked ? 'apply' : 'plan'

          if (!document.querySelector('#new_comment_field').value) {
              return
          }

          document.querySelector('#new_comment_field').value = document.querySelector('#new_comment_field').value.replace(/(apply|plan)/gmi, actionText)

          setTimeout(() => Array.from(document.querySelectorAll('.btn-primary.btn')).find(btn => btn.innerText === 'Comment')?.removeAttribute('disabled'), 50)
        })

        var addButton = (name, env, rightPad = 0) => {
            var newButton = document.createElement('button')

            newButton.setAttribute('x-data-n8', true)
            newButton.setAttribute('x-data-n8-name', name)
            newButton.classList.add(...'btn js-quick-submit-alternative js-comment-and-button'.split(' '))
            newButton.style.marginRight = rightPad ? `${rightPad}px` : undefined
            newButton.type = 'button'
            container.parentNode.parentNode.disabled = true
            container.append(newButton)
            setTimeout(() => { newButton.innerText = `${name}` }, 0)
            newButton.addEventListener('click', (e) => {
                e.preventDefault()
                newButton.setAttribute('disabled', true)
                document.querySelector('#new_comment_field').value = `atlantis ${toggle.checked ? 'apply' : 'plan'} -p ${env}`
                setTimeout(() => { newButton.removeAttribute('disabled') }, 1_000)
                Array.from(document.querySelectorAll('.btn-primary.btn')).find(btn => btn.innerText === 'Comment')?.removeAttribute('disabled')
            })
        }

        document.querySelector('#new_comment_field').addEventListener('keyup', () => {
            [...container.children].forEach((el) => {
                el.innerText = el.getAttribute('x-data-n8-name')
            })
        })

        addButton('TST', 'infrastructure-eu-central-1-testing', 5)
        addButton('STG', 'infrastructure-eu-central-1-staging', 5)
        addButton('PRD [NA]', 'infrastructure-us-east-1-production', 5)
        addButton('PRD [EU]', 'infrastructure-eu-central-1-production', 5)

        container.append(toggle)

        clearInterval(interval);
    }

    interval = setInterval(addElements, 500)
})()

function createToggle(handler) {
    const toggle = document.createElement('input')
    const toggleClassName = `toggle-n8`
    const styleId = 'toggle-n8'

    if (!document.querySelector(`style#${styleId}`)) {
        const style = document.createElement('style')

        style.id = styleId

        style.textContent = `
          .${toggleClassName} {
            appearance: none;
            background-color: #707070;
            border-radius: 1.5em;
            border: none;
            box-sizing: content-box;
            cursor: pointer;
            display: inline-block;
            height: 2em;
            overflow: hidden;
            padding: 0.2em;
            position: relative;
            transition: background ease 0.3s;
            width: 6em;

            &:before {
              content: "apply  plan";
              display: block;
              position: absolute;
              z-index: 2;
              width: 2em;
              height: 2em;
              font-family: system-ui;
              font-size: 1em;
              line-height: 2em;
              font-weight: 500;
              text-transform: uppercase;
              text-indent: -3.5em;
              word-spacing: 2.55em;
              text-shadow: -1px -1px rgba(0,0,0,0.15);
              white-space: nowrap;
              background: #fff;
              color: #fff;
              border-radius: 1.5em;
              transition: transform cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
            }

            &:checked {
              background-color: red;
            }

            &:checked:before {
              transform: translateX(4em);
            }
          }
        `

        document.body.append(style)
    }

    toggle.type = 'checkbox'
    toggle.classList.add(toggleClassName)

    return toggle
}