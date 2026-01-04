// ==UserScript==
// @name         qianmo_job
// @version      0.0.3
// @include      http://newqianmo.baidu.com/404
// @description  self mode
// @run-at       document-start
// @namespace    https://greasyfork.org/users/164996
// @downloadURL https://update.greasyfork.org/scripts/387568/qianmo_job.user.js
// @updateURL https://update.greasyfork.org/scripts/387568/qianmo_job.meta.js
// ==/UserScript==
const head = `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>job</title>
<style>
  body {
    user-select: none;
    cursor: pointer;
    margin: 0;
  }
  #table {
    display: grid;
    grid-template-columns: repeat(9, auto);
    grid-column-gap: 1em;
  }
  #node {
    #width: fit-content;
    display: grid;
    grid-template-columns: repeat(6, auto);
    grid-column-gap: 1em;
    color: #9E9E9E;
  }
  div.running {
    color: #2196F3;
  }
  div.other {
    color: #9E9E9E;
  }
  div.cancelled {
    color: #FF5722;
  }
  div.failed {
    color: #E91E63;
  }
  div.completed {
    color: #673AB7;
  }
  div.pending {
    color: #FF9800;
  }
  div.preempted {
    color: #3f51b5;
  }
  #disconnect{
    display: none;
    color: #bbb;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
  }
  span.button{
    user-select:none;
    cursor:pointer;
  }
  div.section{
    grid-column: 1 / -1;
  }
  iframe{
    display: none;
  }
</style>`
const body = `<div id="app">
<div id='disconnect'>disconnect</div>
<div id="node"></div>
<div id="table"></div>
<iframe src="http://newqianmo.baidu.com/index.jsp#/console"></iframe>
</div>`
document.head.innerHTML = head
document.body.innerHTML = body
const timeout = 10000
const app = document.querySelector('#app')
const node = document.querySelector('#node')
const table = document.querySelector('#table')
const disconnect = document.querySelector('#disconnect')
const copy = text => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}
const parse = s => {
  const t = document.implementation.createHTMLDocument()
  t.body.innerHTML = s
  return t
}
const fetchWithTimeout = (url, options) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ])
}
const fetchList = async url => {
  let data = await fetchWithTimeout(url)
  data = await data.json()
  data = data.retData.rows
  return data
}
const fetchResource = async () => {
  const url =
    'http://newqianmo.baidu.com/action/gpu/queryGpuResource?pageNum=1&pageSize=5&isPersonal=1'
  return await fetchList(url)
}
const fetchTask = async (type = '', size = 20) => {
  const url = `http://newqianmo.baidu.com/action/gpu/queryGpuJobListPerson?pageNum=1&pageSize=${size}&isProjectList=0&jobId=&jobName=&queueName=&status=`
  return await fetchList(url + type)
}
const main = async () => {
  let data
  try {
    data = (await Promise.all([
      fetchTask('RUNNING'),
      fetchTask('PENDING', 5),
      fetchTask('FAILED', 5),
      fetchTask('PREEMPTED', 5),
      fetchTask('CANCELLED', 5)
      //fetchTask('COMPLETED', 5),
    ]))
      .filter(i => i)
      .flat()
  } catch (err) {
    disconnect.style.display = 'block'
    return
  }
  disconnect.style.display = 'none'
  let type_pre = ''
  let b = data.reduce((a, c) => {
    let url = ''
    try {
      url = new URL(c.jobLogUrl)
      url.pathname = ''
      url.port = 8825
    } catch {}
    const link = `<a target="_blank" href="${url}">tb</a>
      <a target="_blank" href="${c.jobLogUrl}">job</a>
      <a target="_blank" href="${c.workspaceUrl}">workspace</a>`
    url = url.hostname
    const ssh_action = `ssh slurm@${url} -t 'cd job/tmp/job-${c.slurmId};bash'`
    const rsync_action = `rsync -av slurm@${url}:job/tmp/job-${c.slurmId}/cdsr/runs .`
    const action = `<span class=button data-copy="${ssh_action}">ssh</span>
    <span class=button  data-copy="${rsync_action}">rsync</span>
    <span class=button data-copy="deljob -j${c.jobId}">deljob</span>`
    const list = [
      c.jobName,
      c.jobId,
      c.priority,
      c.queueName,
      c.ncpus,
      c.gpuRatio,
      c.elapsed,
      action,
      link
    ]
    const type = c.status.toLowerCase()
    if (type !== type_pre) {
      type_pre = type
      a += `<div class="section ${type}">${type}</div>`
    }
    const row = list.map(i => `<div class=${type}>` + i + '</div>').join('')
    return a + row
  }, '')
  // node
  data = await fetchResource()
  let d = data.reduce((a, c) => {
    const list = [
      c.queueName,
      c.gpuType + ' x ' + c.gpuPerNode,
      Number(c.quota) - Number(c.used)
    ]
    const row = list.map(i => `<div>` + i + '</div>').join('')
    return a + row
  }, '')
  requestAnimationFrame(() => {
    node.innerHTML = d
    table.innerHTML = b
  })
}
main()
let timer = setInterval(main, timeout)
let changeTimer
document.addEventListener('click', e => {
  const type = e.target.textContent
  const target = e.target
  let text = ''
  if (['ssh', 'rsync', 'deljob'].includes(type)) {
    text = target.dataset.copy
  } else if (target.children.length === 0) {
    text = target.textContent.trim()
  }
  if (text.length === 0) return
  copy(text)
})
document.addEventListener('visibilitychange', () => {
  clearTimeout(changeTimer)
  if (document.hidden) {
    changeTimer = setTimeout(() => clearInterval(timer), timeout)
  } else {
    main()
    clearInterval(timer)
    timer = setInterval(main, timeout)
  }
})

const frame = document.querySelector('iframe')
setInterval(() => {
  frame.contentWindow.location.reload()
}, 1000 * 3600)
