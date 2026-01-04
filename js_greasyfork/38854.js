// ==UserScript==
// @name         [Worker MTurk] Group Id History
// @namespace    https://github.com/Kadauchi
// @version      1.0.1
// @description  Saves the most recently viewed source for all different type of HITs
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/groupIds
// @include      https://worker.mturk.com/projects/*/tasks*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/38854/%5BWorker%20MTurk%5D%20Group%20Id%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/38854/%5BWorker%20MTurk%5D%20Group%20Id%20History.meta.js
// ==/UserScript==

if (window.location.href === `https://worker.mturk.com/groupIds`) groupIds()
else projects()

async function groupIds () {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }

  const table = document.createElement(`table`)
  table.className = `table table-striped`
  document.body.appendChild(table)

  const thead = document.createElement(`thead`)
  table.appendChild(thead)

  const thName = document.createElement(`th`)
  thName.textContent = `Name`
  thead.appendChild(thName)

  const thTitle = document.createElement(`th`)
  thTitle.textContent = `Title`
  thead.appendChild(thTitle)

  const thReward = document.createElement(`th`)
  thReward.className = `text-xs-center`
  thReward.textContent = `Reward`
  thead.appendChild(thReward)

  const thActions = document.createElement(`th`)
  thActions.className = `text-xs-center`
  thActions.textContent = `Actions`
  thActions.style.width = `150px`
  thead.appendChild(thActions)

  const tbody = document.createElement(`tbody`)
  table.appendChild(tbody)

  const hits = JSON.parse(await GM.getValue(`hits`, `{}`))
  const sorted = Object.keys(hits).sort((a, b) => hits[a].viewed - hits[b].viewed)

  for (let i = sorted.length - 1; i > -1; i --) {
    const key = sorted[i]
    const hit = hits[key]

    const row = document.createElement(`tr`)

    const name = document.createElement(`td`)
    name.textContent = hit.name
    row.appendChild(name)

    const title = document.createElement(`td`)
    title.textContent = hit.title
    row.appendChild(title)

    const reward = document.createElement(`td`)
    reward.className = `text-xs-center`
    reward.textContent = `$${hit.reward.toFixed(2)}`
    row.appendChild(reward)

    const actions = document.createElement(`td`)
    actions.className = `text-xs-center`
    row.appendChild(actions)

    const preview = document.createElement(`a`)
    preview.href = `https://worker.mturk.com/projects/${key}/tasks`
    preview.target = `_blank`
    preview.className = `p-r-sm preview`
    preview.textContent = `Preview`
    actions.appendChild(preview)

    const view = document.createElement(`a`)
    view.href = hit.src
    view.target = `_blank`
    view.title = new Date(hit.viewed)
    view.className = `btn btn-primary`
    view.textContent = `View Source`
    view.style.marginRight = `5px`
    actions.appendChild(view)

    tbody.appendChild(row)
  }
}

async function projects () {
  const id = window.location.href.match(/projects\/([A-Z0-9]+)\/tasks/)[1]
  const details = document.querySelector(`[data-react-class="require('reactComponents/common/ShowModal')['default']"]`)

  if (id && details) {
    const props = JSON.parse(details.dataset.reactProps)
    const hits = JSON.parse(await GM.getValue(`hits`, `{}`))

    hits[id] = {
      src: document.querySelector(`iframe.embed-responsive-item`).src,
      name: props.modalOptions.requesterName,
      title: props.modalOptions.projectTitle,
      reward: props.modalOptions.monetaryReward.amountInDollars,
      viewed: +new Date()
    }

    GM.setValue(`hits`, JSON.stringify(hits))
  }
}
