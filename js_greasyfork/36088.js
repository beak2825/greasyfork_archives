// ==UserScript==
// @name         [MTurk Worker] HIT Exporter
// @namespace    https://github.com/Kadauchi
// @version      1.0.3
// @description  Allows you to export HITs as formatted text with short, plain, bbcode or markdown styling.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/36088/%5BMTurk%20Worker%5D%20HIT%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/36088/%5BMTurk%20Worker%5D%20HIT%20Exporter.meta.js
// ==/UserScript==

/* globals GM_setClipboard */

const hitExports = `all` // Valid options are: `all`, `short`, `plain`, `bbcode` or `markdown`
const turkerview = true // Use turkerview in HIT exports
const turkopticon = true // Use turkopticon in HIT exports
const turkopticon2 = true // Use turkopticon2 in HIT exports

async function short (event, object) {
  window.alert(`Short exports are not supported yet`)
}

async function plain (event, object) {
  const hit = object || JSON.parse(event.target.dataset.hit)
  const requesterReview = await getRequesterReview(hit.requester_id)
  const reviewsTemplate = []

  if (requesterReview.turkerview !== undefined) {
    const tv = requesterReview.turkerview
    const tvRatings = tv.ratings

    reviewsTemplate.push([
      `TV:`,
      `[Hrly: $${tvRatings.hourly}]`,
      `[Pay: ${tvRatings.pay}]`,
      `[Fast: ${tvRatings.fast}]`,
      `[Comm: ${tvRatings.comm}]`,
      `[Rej: ${tv.rejections}]`,
      `[ToS: ${tv.tos}]`,
      `[Blk: ${tv.blocks}]`,
      `• https://turkerview.com/requesters/${hit.requester_id}`

    ].join(` `))
  } else if (turkerview === true) {
    reviewsTemplate.push(`TV: No Reviews • https://turkerview.com/requesters/${hit.requester_id}`)
  }

  if (requesterReview.turkopticon !== undefined) {
    const to = requesterReview.turkopticon
    const toAttrs = to.attrs

    reviewsTemplate.push([
      `TO:`,
      `[Pay: ${toAttrs.pay}]`,
      `[Fast: ${toAttrs.fast}]`,
      `[Comm: ${toAttrs.comm}]`,
      `[Fair: ${toAttrs.fair}]`,
      `[Reviews: ${to.reviews}]`,
      `[ToS: ${to.tos_flags}]`,
      `• https://turkopticon.ucsd.edu/${hit.requester_id}`
    ].join(` `))
  } else if (turkopticon === true) {
    reviewsTemplate.push(`TO: No Reviews • https://turkopticon.ucsd.edu/${hit.requester_id}`)
  }

  if (requesterReview.turkopticon2 !== undefined) {
    const to2 = requesterReview.turkopticon2
    const to2Recent = to2.recent

    reviewsTemplate.push([
      `TO2:`,
      `[Hrly: ${to2Recent.reward[1] > 0 ? `${(to2Recent.reward[0] / to2Recent.reward[1] * 3600).toMoneyString()}` : `---`}]`,
      `[Pen: ${to2Recent.pending > 0 ? `${(to2Recent.pending / 86400).toFixed(2)} days` : `---`}]`,
      `[Res: ${to2Recent.comm[1] > 0 ? `${Math.round(to2Recent.comm[0] / to2Recent.comm[1] * 100)}% of ${to2Recent.comm[1]}` : `---`}]`,
      `[Rec: ${to2Recent.recommend[1] > 0 ? `${Math.round(to2Recent.recommend[0] / to2Recent.recommend[1] * 100)}% of ${to2Recent.recommend[1]}` : `---`}]`,
      `[Rej: ${to2Recent.rejected[0]}]`,
      `[ToS: ${to2Recent.tos[0]}]`,
      `[Brk: ${to2Recent.broken[0]}]`,
      `https://turkopticon.info/requesters/${hit.requester_id}`
    ].join(` `))
  } else if (turkopticon2 === true) {
    reviewsTemplate.push(`TO2: No Reviews • https://turkopticon.info/requesters/${hit.rid}`)
  }

  const exportTemplate = [
    `Title: ${hit.title} • https://worker.mturk.com/projects/${hit.hit_set_id}/tasks • https://worker.mturk.com/projects/${hit.hit_set_id}/tasks/accept_random`,
    `Requester: ${hit.requester_name} • https://worker.mturk.com/requesters${hit.requester_id}/projects`,
    reviewsTemplate.join(`\n`),
    `Reward: ${hit.monetary_reward.amount_in_dollars.toMoneyString()}`,
    `Duration: ${hit.assignment_duration_in_seconds.toTimeString()}`,
    `Available: ${hit.assignable_hits_count}`,
    `Description: ${hit.description}`,
    `Requirements: ${hit.project_requirements.map(o => `${o.qualification_type.name} ${o.comparator} ${o.qualification_values.map(v => v).join(`, `)}`.trim()).join(`; `)}`
  ].filter((item) => item !== undefined).join(`\n`)

  GM_setClipboard(exportTemplate)

  const notification = new window.Notification(`Plain HIT Export has been copied to your clipboard.`)
  setTimeout(notification.close.bind(notification), 10000)
}

async function bbcode (event, object) {
  const hit = object || JSON.parse(event.target.dataset.hit)
  const requesterReview = await getRequesterReview(hit.requester_id)
  const reviewsTemplate = []

  const ratingColor = (rating) => {
    if (rating > 3.99) {
      return `[color=#00cc00]${rating}[/color]`
    } else if (rating > 2.99) {
      return `[color=#cccc00]${rating}[/color]`
    } else if (rating > 1.99) {
      return `[color=#cc6600]${rating}[/color]`
    } else if (rating > 0.00) {
      return `[color=#cc0000]${rating}[/color]`
    }
    return rating
  }

  const percentColor = (rating) => {
    if (rating[1] > 0) {
      const percent = Math.round(rating[0] / rating[1] * 100)

      if (percent > 79) {
        return `[color=#00cc00]${percent}%[/color] of ${rating[1]}`
      } else if (percent > 59) {
        return `[color=#cccc00]${percent}%[/color] of ${rating[1]}`
      } else if (percent > 39) {
        return `[color=#cc6600]${percent}%[/color] of ${rating[1]}`
      }
      return `[color=#cc0000]${percent}%[/color] of ${rating[1]}`
    }
    return `---`
  }

  const goodBadColor = (rating) => {
    return `[color=${rating === 0 ? `#00cc00` : `#cc0000`}]${rating}[/color]`
  }

  if (requesterReview.turkerview !== undefined) {
    const tv = requesterReview.turkerview

    reviewsTemplate.push([
      `[b][url=https://turkerview.com/requesters/${hit.requester_id}]TV[/url]:`,
      `[Hrly: $${tv.ratings.hourly}]`,
      `[Pay: ${ratingColor(tv.ratings.pay)}]`,
      `[Fast: ${ratingColor(tv.ratings.fast)}]`,
      `[Comm: ${ratingColor(tv.ratings.comm)}]`,
      `[Rej: ${goodBadColor(tv.rejections)}]`,
      `[ToS: ${goodBadColor(tv.tos)}]`,
      `[Blk: ${goodBadColor(tv.blocks)}][/b]`
    ].join(` `))
  } else if (turkerview === true) {
    reviewsTemplate.push(`[b][url=https://turkerview.com/requesters/${hit.requester_id}]TV[/url]:[/b] No Reviews`)
  }

  if (requesterReview.turkopticon !== undefined) {
    const to = requesterReview.turkopticon
    const toAttrs = to.attrs

    if (toAttrs) {
      reviewsTemplate.push([
        `[b][url=https://turkopticon.ucsd.edu/${hit.requester_id}]TO[/url]:`,
        `[Pay: ${ratingColor(toAttrs.pay)}]`,
        `[Fast: ${ratingColor(toAttrs.fast)}]`,
        `[Comm: ${ratingColor(toAttrs.comm)}]`,
        `[Fair: ${ratingColor(toAttrs.fair)}]`,
        `[Reviews: ${to.reviews}]`,
        `[ToS: ${goodBadColor(to.tos_flags)}][/b]`
      ].join(` `))
    } else {
      reviewsTemplate.push(`[b][url=https://turkopticon.ucsd.edu/${hit.requester_id}]TO[/url]:[/b] No Reviews`)
    }
  } else if (turkopticon === true) {
    reviewsTemplate.push(`[b][url=https://turkopticon.ucsd.edu/${hit.requester_id}]TO[/url]:[/b] No Reviews`)
  }

  if (requesterReview.turkopticon2 !== undefined) {
    const to2 = requesterReview.turkopticon2
    const to2Recent = to2.recent

    reviewsTemplate.push([
      `[b][url=https://turkopticon.info/requesters/${hit.requester_id}]TO2[/url]:`,
      `[Hrly: ${to2Recent.reward[1] > 0 ? `${(to2Recent.reward[0] / to2Recent.reward[1] * 3600).toMoneyString()}` : `---`}]`,
      `[Pen: ${to2Recent.pending > 0 ? `${(to2Recent.pending / 86400).toFixed(2)} days` : `---`}]`,
      `[Res: ${percentColor(to2Recent.comm)}]`,
      `[Rec: ${percentColor(to2Recent.recommend)}]`,
      `[Rej: ${goodBadColor(to2Recent.rejected[0])}]`,
      `[ToS: ${goodBadColor(to2Recent.tos[0])}]`,
      `[Brk: ${goodBadColor(to2Recent.broken[0])}][/b]`
    ].join(` `))
  } else if (turkopticon2 === true) {
    reviewsTemplate.push(`[b][url=https://turkopticon.info/requesters/${hit.requester_id}]TO2[/url]:[/b] No Reviews`)
  }

  const exportTemplate = [
    `[b]Title:[/b] [url=https://worker.mturk.com/projects/${hit.hit_set_id}/tasks]${hit.title}[/url] | [url=https://worker.mturk.com/projects/${hit.hit_set_id}/tasks/accept_random]PANDA[/url]`,
    `[b]Requester:[/b] [url=https://worker.mturk.com/requesters/${hit.requester_id}/projects]${hit.requester_name}[/url] [${hit.requester_id}] ([url=https://worker.mturk.com/requesters/${hit.requester_id}]Contact[/url])`,
    reviewsTemplate.join(`\n`),
    `[b]Reward:[/b] ${hit.monetary_reward.amount_in_dollars.toMoneyString()}`,
    `[b]Duration:[/b] ${hit.assignment_duration_in_seconds.toTimeString()}`,
    `[b]Available:[/b] ${hit.assignable_hits_count}`,
    `[b]Description:[/b] ${hit.description}`,
    `[b]Requirements:[/b] ${hit.project_requirements.map(o => `${o.qualification_type.name} ${o.comparator} ${o.qualification_values.map(v => v).join(`, `)}`.trim()).join(`; `)}`
  ].filter((item) => item !== undefined).join(`\n`)

  GM_setClipboard(`[table][tr][td]${exportTemplate}[/td][/tr][/table]`)

  const notification = new window.Notification(`BBCode HIT Export has been copied to your clipboard.`)
  setTimeout(notification.close.bind(notification), 10000)
}

async function markdown (event, object) {
  const hit = object || JSON.parse(event.target.dataset.hit)
  const requesterReview = await getRequesterReview(hit.requester_id)
  const reviewsTemplate = []

  if (requesterReview.turkerview !== undefined) {
    const tv = requesterReview.turkerview
    const tvRatings = tv.ratings

    reviewsTemplate.push([
      `**[TV](https://turkerview.com/requesters/${hit.requester_id}):**`,
      `[Hrly: $${tvRatings.hourly}]`,
      `[Pay: ${tvRatings.pay}]`,
      `[Fast: ${tvRatings.fast}]`,
      `[Comm: ${tvRatings.comm}]`,
      `[Rej: ${tv.rejections}]`,
      `[ToS: ${tv.tos}]`,
      `[Blk: ${tv.blocks}]`
    ].join(` `))
  } else if (turkerview === true) {
    reviewsTemplate.push(`TV: No Reviews • https://turkerview.com/requesters/${hit.requester_id}`)
  }

  if (requesterReview.turkopticon !== undefined) {
    const to = requesterReview.turkopticon
    const toAttrs = to.attrs

    reviewsTemplate.push([
      `**[TO](https://turkopticon.ucsd.edu/${hit.requester_id}):**`,
      `[Pay: ${toAttrs.pay}]`,
      `[Fast: ${toAttrs.fast}]`,
      `[Comm: ${toAttrs.comm}]`,
      `[Fair: ${toAttrs.fair}]`,
      `[Reviews: ${to.reviews}]`,
      `[ToS: ${to.tos_flags}]`
    ].join(` `))
  } else if (turkopticon === true) {
    reviewsTemplate.push(`TO: No Reviews • https://turkopticon.ucsd.edu/${hit.requester_id}`)
  }

  if (requesterReview.turkopticon2 !== undefined) {
    const to2 = requesterReview.turkopticon2
    const to2Recent = to2.recent

    reviewsTemplate.push([
      `**[TO2](https://turkopticon.info/requesters/${hit.requester_id}):**`,
      `[Hrly: ${to2Recent.reward[1] > 0 ? `${(to2Recent.reward[0] / to2Recent.reward[1] * 3600).toMoneyString()}` : `---`}]`,
      `[Pen: ${to2Recent.pending > 0 ? `${(to2Recent.pending / 86400).toFixed(2)} days` : `---`}]`,
      `[Res: ${to2Recent.comm[1] > 0 ? `${Math.round(to2Recent.comm[0] / to2Recent.comm[1] * 100)}% of ${to2Recent.comm[1]}` : `---`}]`,
      `[Rec: ${to2Recent.recommend[1] > 0 ? `${Math.round(to2Recent.recommend[0] / to2Recent.recommend[1] * 100)}% of ${to2Recent.recommend[1]}` : `---`}]`,
      `[Rej: ${to2Recent.rejected[0]}]`,
      `[ToS: ${to2Recent.tos[0]}]`,
      `[Brk: ${to2Recent.broken[0]}]`,
      ``
    ].join(` `))
  } else if (turkopticon2 === true) {
    reviewsTemplate.push(`TO2: No Reviews • https://turkopticon.info/requesters/${hit.rid}`)
  }

  const exportTemplate = [
    `> **Title:** [${hit.title}](https://worker.mturk.com/projects/${hit.hit_set_id}/tasks) | [PANDA](https://worker.mturk.com/projects/${hit.hit_set_id}/tasks/accept_random)`,
    `**Requester:** [${hit.requester_name}](https://worker.mturk.com/requesters${hit.requester_id}/projects) [${hit.requester_id}] ([Contact](https://worker.mturk.com/contact?requesterId=${hit.requester_id}))`,
    reviewsTemplate.join(`  \n`),
    `**Reward:** ${hit.monetary_reward.amount_in_dollars.toMoneyString()}`,
    `**Duration:** ${hit.assignment_duration_in_seconds.toTimeString()}`,
    `**Available:** ${hit.assignable_hits_count}`,
    `**Description:** ${hit.description}`,
    `**Requirements:** ${hit.project_requirements.map(o => `${o.qualification_type.name} ${o.comparator} ${o.qualification_values.map(v => v).join(`, `)}`.trim()).join(`; `)}`
  ]
    .filter((item) => item !== undefined).join(`  \n`)

  GM_setClipboard(exportTemplate)

  const notification = new window.Notification(`Markdown HIT Export has been copied to your clipboard.`)
  setTimeout(notification.close.bind(notification), 10000)
}

async function getRequesterReview (id) {
  return new Promise(async (resolve) => {
    const getReview = (stringSite, stringURL) => {
      return new Promise(async (resolve) => {
        try {
          const response = await window.fetch(stringURL)

          if (response.status === 200) {
            const json = await response.json()
            resolve([stringSite, json.data ? Object.assign(...json.data.map((item) => ({ [item.id]: item.attributes.aggregates }))) : json])
          } else {
            resolve()
          }
        } catch (error) {
          resolve()
        }
      })
    }

    const promises = []

    if (turkerview === true) {
      promises.push(getReview(`turkerview`, `https://turkerview.com/api/v1/requesters/?ids=${id}`))
    }
    if (turkopticon === true) {
      promises.push(getReview(`turkopticon`, `https://turkopticon.ucsd.edu/api/multi-attrs.php?ids=${id}`))
    }
    if (turkopticon2 === true) {
      promises.push(getReview(`turkopticon2`, `https://api.turkopticon.info/requesters?rids=${id}&fields[requesters]=aggregates`))
    }

    const getReviewAll = await Promise.all(promises)

    const objectReview = {}

    for (const item of getReviewAll) {
      if (item && item.length > 0) {
        const site = item[0]
        const reviews = item[1]

        for (const key in reviews) {
          objectReview[site] = reviews[key]
        }
      }
    }
    resolve(objectReview)
  })
}

(function () {
  const react = document.querySelector(`div[data-react-class="require('reactComponents/hitSetTable/HitSetTable')['default']"]`) ||
          document.querySelector(`div[data-react-class="require('reactComponents/taskQueueTable/TaskQueueTable')['default']"]`)

  if (react) {
    const hitExportButton = (text, callback) => {
      const div = document.createElement(`div`)
      div.className = `col-xs-6`

      const button = document.createElement(`button`)
      button.className = `btn btn-primary btn-hit-export`
      button.textContent = text
      button.style.width = `100%`
      button.addEventListener(`click`, callback)
      div.appendChild(button)

      return div
    }

    const modal = document.createElement(`div`)
    modal.className = `modal`
    modal.id = `hitExportModal`
    document.body.appendChild(modal)

    const modalDialog = document.createElement(`div`)
    modalDialog.className = `modal-dialog`
    modal.appendChild(modalDialog)

    const modalContent = document.createElement(`div`)
    modalContent.className = `modal-content`
    modalDialog.appendChild(modalContent)

    const modalHeader = document.createElement(`div`)
    modalHeader.className = `modal-header`
    modalContent.appendChild(modalHeader)

        // modal close here

    const modalTitle = document.createElement(`h2`)
    modalTitle.className = `modal-title`
    modalTitle.textContent = `HIT Export`
    modalHeader.appendChild(modalTitle)

    const modalBody = document.createElement(`div`)
    modalBody.className = `modal-body`
    modalContent.appendChild(modalBody)

    const modalBodyRow1 = document.createElement(`div`)
    modalBodyRow1.className = `row`
    modalBody.appendChild(modalBodyRow1)
    modalBodyRow1.appendChild(hitExportButton(`Short`, short))
    modalBodyRow1.appendChild(hitExportButton(`Plain`, plain))

    const modalBodyRow2 = document.createElement(`div`)
    modalBodyRow2.className = `row`
    modalBody.appendChild(modalBodyRow2)
    modalBodyRow2.appendChild(hitExportButton(`BBCode`, bbcode))
    modalBodyRow2.appendChild(hitExportButton(`Markdown`, markdown))

    const style = document.createElement(`style`)
    style.innerHTML = `.modal-backdrop.in { z-index: 1049; }`
    document.head.appendChild(style)

    const json = JSON.parse(react.dataset.reactProps).bodyData
    const hitRows = react.getElementsByClassName(`table-row`)

    for (let i = 0; i < hitRows.length; i++) {
      const hit = json[i].project ? json[i].project : json[i]
      const project = hitRows[i].getElementsByClassName(`project-name-column`)[0]

      const button = document.createElement(`button`)
      button.className = `btn btn-primary btn-sm`
      button.textContent = `Export`
      button.style.marginRight = `5px`
      project.prepend(button)

      if (hitExports === `all`) {
        button.dataset.toggle = `modal`
        button.dataset.target = `#hitExportModal`
        button.addEventListener(`click`, (event) => {
          event.target.closest(`.desktop-row`).click()

          for (const element of document.getElementsByClassName(`btn-hit-export`)) {
            element.dataset.hit = JSON.stringify(hit)
          }
        })
      } else {
        button.addEventListener(`click`, (event) => {
          event.target.closest(`.desktop-row`).click()

          if (hitExports === `short`) {
            short(event, hit)
          } else if (hitExports === `plain`) {
            plain(event, hit)
          } else if (hitExports === `bbcode`) {
            bbcode(event, hit)
          } else if (hitExports === `markdown`) {
            markdown(event, hit)
          }
        })
      }
    }
  }
})()

Object.assign(Number.prototype, {
  toMoneyString () {
    return `$${this.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`
  },
  toTimeString () {
    let day
    let hour
    let minute
    let seconds = this
    minute = Math.floor(seconds / 60)
    seconds = seconds % 60
    hour = Math.floor(minute / 60)
    minute = minute % 60
    day = Math.floor(hour / 24)
    hour = hour % 24

    let string = ``

    if (day > 0) {
      string += `${day} day${day > 1 ? `s` : ``} `
    }
    if (hour > 0) {
      string += `${hour} hour${hour > 1 ? `s` : ``} `
    }
    if (minute > 0) {
      string += `${minute} day${minute > 1 ? `s` : ``}`
    }
    return string.trim()
  }
})
