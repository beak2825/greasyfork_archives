// ==UserScript==
// @name         dormakaba empirie-fier
// @namespace    http://empiriecom.com/
// @version      2025-11-13
// @description  Make dormakaba more usable
// @author       senritsu
// @match        https://zeiterfassung.bb.baur-gruppe.com/bcommerp/person/web-terminal
// @icon         https://empiriecom.com/default-wGlobal/wGlobal/layout/images/site-icons/favicon.png
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531803/dormakaba%20empirie-fier.user.js
// @updateURL https://update.greasyfork.org/scripts/531803/dormakaba%20empirie-fier.meta.js
// ==/UserScript==

(function() {
'use strict';
const EmpLogo = () => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 622.9 188.5" style="enable-background:new 0 0 622.9 188.5;" xml:space="preserve">
<style type="text/css">
    .st0{fill:#828282;}
    .st1{fill:#AA0B1E;}
    .st2{fill:#FFFFFF;}
    .st3{display:none;}
</style>
<g id="Ebene_2">
    <g>
        <path d="M412,75.8c6.3,0,11.7,3.5,14.7,8.8l4.9-1.8l4.9-1.8c-4.5-8.8-13.8-14.9-24.5-14.9c-15.2,0-27.5,12.2-27.5,27.1
            s12.3,27.1,27.5,27.1c10.7,0,20-6.1,24.5-14.9l-9.9-3.6c-2.9,5.3-8.4,8.8-14.7,8.8c-9.3,0-16.9-7.8-16.9-17.5
            C395.1,83.7,402.7,75.8,412,75.8z"/>
        <path d="M351.6,66.2c-15.2,0-27.5,12.2-27.5,27.1s12.3,27.1,27.5,27.1c10.7,0,20-6.1,24.5-14.9l-9.9-3.6
            c-2.9,5.3-8.4,8.8-14.7,8.8c-8.3,0-15.2-6.2-16.6-14.4h33.2h10.7c0.1-1,0.2-2,0.2-3.1c0-1.9-0.2-3.8-0.6-5.5
            C375.9,75.4,364.8,66.2,351.6,66.2z M335.6,87.8c2.2-6.9,8.6-11.9,16-11.9s13.8,5,16,11.9H335.6z"/>
        <path d="M82.4,66.2c-15.2,0-27.5,12.2-27.5,27.1s12.3,27.1,27.5,27.1c10.7,0,20-6.1,24.5-14.9L97,102c-2.9,5.3-8.4,8.8-14.7,8.8
            c-8.3,0-15.2-6.2-16.6-14.4H99h10.7c0.1-1,0.2-2,0.2-3.1c0-1.9-0.2-3.8-0.6-5.5C106.7,75.4,95.6,66.2,82.4,66.2z M66.4,87.8
            c2.2-6.9,8.6-11.9,16-11.9s13.8,5,16,11.9H66.4z"/>
        <path class="st1" d="M450.9,93.3c0-5,2-9.5,5.3-12.7l14.3-14.4c-0.9-0.1-1.8-0.1-2.7-0.1c-15.2,0-27.5,12.2-27.5,27.1
            c0,11.9,7.7,21.9,18.4,25.6l8.2-8.2C458,110.3,450.9,102.7,450.9,93.3z"/>
        <path d="M476.8,67.7l-8.2,8.2c8.9,0.4,16.1,8.1,16.1,17.4c0,5-2,9.4-5.2,12.6l-14.4,14.4c0.9,0.1,1.8,0.1,2.7,0.1
            c15.2,0,27.5-12.2,27.5-27.1C495.3,81.4,487.5,71.4,476.8,67.7z"/>
        <path d="M220.9,66.3c-6.3,0-12.2,2.1-16.8,5.7v-3.7h-10.4V136h10.4v-21.2c4.7,3.6,10.5,5.7,16.8,5.7c15.2,0,27.5-12.2,27.5-27.1
            S236.1,66.3,220.9,66.3z M220.9,110.9c-9,0-16.3-7.3-16.8-16.4v-2.1c0.5-9.2,7.9-16.4,16.8-16.4c9.3,0,16.9,7.8,16.9,17.5
            S230.2,110.9,220.9,110.9z"/>
        <path d="M289.4,69.7c-1.5,1.1-2.7,2.5-3.6,4.2v-4.3h-10.4v50.8h10.4V86.1c0.1-2.1,0.8-3.9,2.3-5.2c1.5-1.4,3.3-2.1,5.4-2.1
            c0.6,0,1.3,0.1,2.1,0.4c0.8,0.3,1.5,0.6,2.1,1.1l3.9-10.9c-1.6-1.1-3.6-1.6-6-1.6C293.2,67.8,291.2,68.4,289.4,69.7z"/>
        <rect x="255.7" y="69.7" width="10.4" height="50.8"/>
        <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 34.9282 201.6515)" cx="260.9" cy="58.7" rx="6.1" ry="6.1"/>
        <rect x="307.1" y="69.7" width="10.4" height="50.8"/>
        <ellipse transform="matrix(0.9732 -0.2298 0.2298 0.9732 -5.1224 73.3334)" cx="312.4" cy="58.7" rx="6.1" ry="6.1"/>
        <path d="M165.9,67.8c-5.6,0-10.7,2.4-14.2,6.2c-3.5-3.8-8.6-6.2-14.2-6.2c-10.7,0-19.4,8.7-19.4,19.4v33.3h10.4v-16.1V87.2
            c0-5,4-9,9-9c5,0,9,4,9,9v17.2v16.1h10.4v-16.1V87.2c0-5,4-9,9-9c5,0,9,4,9,9c0,0.1,0,0.1,0,0.2v17v16.1h10.4V87.3
            c0-0.1,0-0.1,0-0.2C185.4,76.5,176.7,67.8,165.9,67.8z"/>
        <path d="M548.6,67.8c-5.6,0-10.7,2.4-14.2,6.2c-3.5-3.8-8.6-6.2-14.2-6.2c-10.7,0-19.4,8.7-19.4,19.4v33.3h10.4v-16.1V87.2
            c0-5,4-9,9-9c5,0,9,4,9,9v17.2v16.1h10.4v-16.1V87.2c0-5,4-9,9-9c5,0,9,4,9,9c0,0.1,0,0.1,0,0.2v17v16.1H568V87.3
            c0-0.1,0-0.1,0-0.2C568,76.5,559.3,67.8,548.6,67.8z"/>
    </g>
</g>
<g id="Ebene_1" class="st3">
</g>
</svg>`

const zeroPad = (part) => part.toString().padStart(2, '0')
const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const time = [hours, minutes % 60, seconds % 60].map(zeroPad).join(':')

  return time
}

const dateTimeRegex =
  /^\d{2}\.\d{2}.\d{4}\s+(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)/

const parseMilliseconds = (dateTimeString) => {
  const { hours, minutes, seconds } = dateTimeRegex.exec(dateTimeString).groups
  return new Date().setHours(hours, minutes, seconds).valueOf()
}

const parseRow = (row) => ({
  type: typeMap[row.children[3].textContent.trim()],
  timestamp: parseMilliseconds(row.children[1].textContent.trim()),
})

const typeMap = {
  Kommen: 'start',
  Gehen: 'stop',
  'Pausen Beginn': 'stop-for-break',
  'Pausen Ende': 'start-from-break',
}

const formatType = (type) => {
  switch (type) {
    case 'start':
    case 'start-from-break':
      return 'Anwesend'
    case 'stop':
      return 'Feierabend 🎉'
    case 'stop-for-break':
      return 'Pause'
    default:
      return '💤'
  }
}

const actionLabels = {
  start: 'Einstempeln',
  'stop-for-break': 'Pause',
  'start-from-break': 'Pause beenden',
  stop: 'Feierabend!',
}

const buttonImageNames = {
  start: 'In',
  'stop-for-break': 'BreakBegin',
  'start-from-break': 'BreakEnd',
  stop: 'Out',
}

const createOverlay = () => {
  const overlayWrapper = document.createElement('div')
  overlayWrapper.classList.add('custom-overlay-wrapper')
  overlayWrapper.innerHTML = `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
.custom-overlay-wrapper {
    --color-darkest: #262729;
    --color-dark: #67696B;
    --color-mid: #DBDBDB;
    --color-light: #F6F6F6;
    --color-white: #FFFFFF;
    --color-primary: #DA3D3D;
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)

    background: white;
    position: fixed;
    border: 1px solid black;
    border-radius: 0.25em;
    box-shadow: var(--shadow);

    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;

    background: var(--color-darkest);
    color: var(--color-white);

    .text-body1 {
        font-size: 18px;
        font-weight: 400;
        line-height: 30px;
        character-spacing: 0.1em;
    }

    .logo {
      position: fixed;
      width: 300px;
      transform: rotate(-12deg);

      .background {
        position: absolute;
        width: 100%;
        height: 55%;
        background: var(--color-mid);
        top: 20%;
        z-index: -1;
      }
    }

    .iconify {
        /* Add dimensions to span */
        display: inline-block;
        width: 16px;
        height: 16px;
        background-color: currentColor;
        -webkit-mask-image: var(--svg);
        mask-image: var(--svg);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
    }

    button {
        background: var(--color-white);
        border: none;
        color: var(--color-darkest);
        padding: 0.5em 1em;
        border-radius: 9999px;
        font-size: 2rem;
        font-weight: 700;
        transition: background 0.2s ease-in-out;

        &:hover:not(:disabled) {
            background: var(--color-light);
        }

        &:disabled {
            color: var(--color-mid);
            display: none;
        }
    }

    button.dark {
        background: var(--color-darkest);
        color: var(--color-white);

        &:hover:not(:disabled) {
            background: var(--color-dark);
        }
    }

    .custom-overlay {
        display: flex;
        flex-direction: column;

        .toggle-button {
            position: absolute;
            top: -8px;
            left: -8px;
            border: 1px solid var(--color-darkest);
            border-radius: 3px;
            padding: 0;
            margin: 0;
            line-height: 0;

            .icon {
                --svg: url(https://api.iconify.design/bx/collapse.svg);
            }
        }

        &.collapsed {
            > :not(.toggle-button) {
                display: none;
            }

            .toggle-button .icon {
                --svg: url(https://api.iconify.design/bx/expand.svg);
            }
        }

        .overlay-row {
            font-size: large;
            display: flex;
            align-items: center;
            padding: 1.5em;
            gap: 0.5em;

            &:not(:last-child) {
                border-bottom: 1px solid var(--color-dark);
            }
        }

        .current-state {
            .icon {
                width: 1em;
                height: 1em;
                border-radius: 50%;
                background: darkgray;

                &.is-running {
                    background: lightgreen;
                }
            }
        }

        .available-actions {
            flex-direction: column;
            align-items: stretch;
        }

        .total-time {
            display: grid;
            grid-template-columns: repeat(3, auto);
        }

        .todo {
            position: absolute;
            inset: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            > span {
                font-weight: 700;
                font-size: 0.8em;
                transform: rotate(-6deg);
                background: var(--color-primary);
                color: white;
                padding: 0.25em;
            }
        }
    }
}
</style>`
  document.body.appendChild(overlayWrapper)

  const overlay = document.createElement('div')
  overlay.classList.add('custom-overlay')
  overlayWrapper.appendChild(overlay)

  overlayWrapper.addEventListener('click', (event) => {
    const action = event.target.dataset.action

    if (action) {
      document
        .querySelector(
          `figure img[src="assets/pictures/icons/image${buttonImageNames[action]}EnabledR40.png"]`,
        )
        .click()

      let maxWaitTimeMs = 3000
      const intervalMs = 50
      const interval = setInterval(() => {
        // kill popup as soon as it appears

        const popupCloseButton = document.querySelector(
          'dk-webterminal-result-dialog button.k-primary',
        )
        if (popupCloseButton) {
          popupCloseButton.click()
          clearInterval(interval)
        }

        maxWaitTimeMs -= intervalMs
        if (maxWaitTimeMs <= 0) {
          clearInterval(interval)
        }
      }, 50)
    }

    if (
      document.querySelector('.toggle-button').contains(event.target) ||
      event.target.classList.contains('toggle-button')
    ) {
      overlay.classList.toggle('collapsed')

      update()
    }
  })

  return overlay
}

const positionLeftAlignedFrom = (selector, offset) => {
  const anchor = document.querySelector(selector)
  const { left, top } = anchor?.getBoundingClientRect() ?? {
    left: 9999,
    top: 9999,
  }

  return `
    left: ${left + offset.x}px;
    top: ${top + offset.y}px;
`
}

const positionRightAlignedFrom = (selector, offset) => {
  const anchor = document.querySelector(selector)
  const { right, top } = anchor?.getBoundingClientRect() ?? {
    right: 9999,
    top: 9999,
  }

  return `
    right: ${window.innerWidth - right + offset.x}px;
    top: ${top + offset.y}px;
`
}

const millisecondsToHours = 1000 * 60 * 60
const getIsRunning = (currentType) => currentType?.startsWith('start') ?? false
const calculateBreakWarning = ({ workMilliseconds, breakMilliseconds }) => {
  if (
    workMilliseconds >= 9 * millisecondsToHours &&
    breakMilliseconds < 0.75 * millisecondsToHours
  )
    return true
  if (
    workMilliseconds >= 6 * millisecondsToHours &&
    breakMilliseconds < 0.5 * millisecondsToHours
  )
    return true
  return false
}

const ActionButtons = ({ currentType }) => {
  const isRunning = getIsRunning(currentType)

  const buttonAttributes = {
    start: `${currentType && currentType !== 'stop' ? 'disabled' : ''}`,
    'stop-for-break': `${!isRunning ? 'disabled' : ''}`,
    'start-from-break': `${currentType !== 'stop-for-break' ? 'disabled' : ''}`,
    stop: `${!isRunning ? 'disabled' : ''}`,
  }

  return Object.entries(buttonAttributes)
    .map(
      ([action, attributes]) => `
        <button type="button" data-action="${action}" ${attributes}>${actionLabels[action]}</button>
    `,
    )
    .join('\n')
}

const OverlayContent = ({
  currentType,
  workMilliseconds,
  workBlockMilliseconds,
  breakMilliseconds,
}) => {
  const isRunning = getIsRunning(currentType)
  const hasBreakWarning = calculateBreakWarning({
    workMilliseconds,
    breakMilliseconds,
  })

  return `
<style>
.custom-overlay-wrapper {
  ${positionLeftAlignedFrom('[role=tabpanel]', { x: 10, y: 10 })}

  .logo {
    ${positionRightAlignedFrom('.webterminal-grid', { x: 20, y: 60 })}
  }
}
</style>
</style>
<button type="button" class="toggle-button dark">
    <span class="iconify icon"></span>
</button>
<div class="logo">
    <div class="background"></div>
    ${EmpLogo()}
</div>
<div class="current-state overlay-row class="text-body1">
    <div class="icon ${isRunning ? 'is-running' : ''}"></div>
    <span>${formatType(currentType)}</span>
</div>
<div class="available-actions overlay-row class="text-body1"">
    ${ActionButtons({ currentType })}
</div>
<div class="total-time overlay-row class="text-body1"">
    <span>Gesamt heute:</span>
    <span>${formatDuration(workMilliseconds)}</span>
    <span>${workMilliseconds >= 9.5 * millisecondsToHours ? '<span title="Ab 10h zu viel Arbeitszeit!">⚠️</span>' : ''}</span>
    <span>Aktuell ohne Pause:</span>
    <span>${formatDuration(workBlockMilliseconds)}</span>
    <span>${workBlockMilliseconds >= 5.5 * millisecondsToHours ? '<span title="Ab 6h ohne Pause zu viel Arbeitszeit!">⚠️</span>' : ''}</span>
    <span>Pausenzeit:</span>
    <span>${formatDuration(breakMilliseconds)}</span>
    <span>${hasBreakWarning ? '<span title="Zu wenig Pausenzeit!">⚠️</span>' : ''}</span>
</div>
`
}

const updateOverlay = (data) => {
  const overlay = document.querySelector('.custom-overlay') ?? createOverlay()

  overlay.innerHTML = OverlayContent(data)
}

const aggregateEntries = (entries) => {
  if (!entries?.length > 0) {
    return { currentType: undefined, workMilliseconds: 0, workBlockMilliseconds: 0, breakMilliseconds: 0 }
  }

  const lastEntry = entries[entries.length - 1]

  const openTime = new Date().valueOf() - lastEntry.timestamp

  const totals = entries.slice(1).reduce(
    (total, entry, index) => {
      const prevEntry = entries[index]
      if (entry.type.startsWith('stop') && prevEntry.type.startsWith('start')) {
        total.workMilliseconds += entry.timestamp - prevEntry.timestamp
      }
      if (
        entry.type.startsWith('start') &&
        prevEntry.type === 'stop-for-break'
      ) {
        total.breakMilliseconds += entry.timestamp - prevEntry.timestamp
      }
      return total
    },
    {
      workMilliseconds: lastEntry.type.startsWith('start') ? openTime : 0,
      workBlockMilliseconds: lastEntry.type.startsWith('start') ? openTime : 0,
      breakMilliseconds: lastEntry.type.startsWith('stop-for-break')
        ? openTime
        : 0,
    },
  )
  
  return { currentType: lastEntry.type, ...totals }
}

let hasNotificationPermission = false
if (window.Notification && Notification.permission !== 'denied') {
  Notification.requestPermission().then((permission) => {
    hasNotificationPermission = permission === 'granted'
  })
}

let lastNotificationTime = 0

const update = async () => {
  const rows = document.querySelectorAll(
    'kendo-grid-list .k-grid-content tbody > tr:not(.k-grid-norecords)',
  )

  const entries = [...rows].toReversed().map(parseRow)

  const data = aggregateEntries(entries)

  updateOverlay(data)

  // only notify once every 5 minutes at most
  if (hasNotificationPermission && Date.now() - lastNotificationTime > 5 * 60 * 1000){
    if (data.workMilliseconds >= 9.5 * millisecondsToHours) {
      new Notification('Arbeitszeit Warnung', {
        body: 'Du hast heute bereits über 9,5 Stunden gearbeitet!',
        tag: 'work-time-warning',
      })
      lastNotificationTime = Date.now()
    }
    if (data.workBlockMilliseconds >= 5.5 * millisecondsToHours) {
      new Notification('Arbeitszeit Warnung', {
        body: 'Du hast heute bereits über 5,5 Stunden ohne Pause gearbeitet! Bitte mache eine Pause.',
        tag: 'work-block-warning',
      })
      lastNotificationTime = Date.now()
    }
  }
}

document.addEventListener('update-custom-overlay', update)
document.addEventListener('update-custom-overlay-manual', (event) => {
  updateOverlay(event.detail)
})

setInterval(update, 1000)

})();