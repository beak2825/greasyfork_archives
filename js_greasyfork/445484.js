// ==UserScript==
// @name         Better youtrack gantt recalculation
// @description  Gantt recalculating by priority order with autoordering in left menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Brin Dmitriy
// @license      MIT 
// @match        http://tasker.*.ru/gantt-charts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vseinstrumenti.ru
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/445484/Better%20youtrack%20gantt%20recalculation.user.js
// @updateURL https://update.greasyfork.org/scripts/445484/Better%20youtrack%20gantt%20recalculation.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const CONFIG_PRIORITY_FIELD_NAME = 'Приоритет'
  const CONFIG_HOURS_IN_DAY = 5

  const isNotWorking = (day) => new Date(day).getDay() === 0 || new Date(day).getDay() === 6

  const addWorkingTime = (startDay, hoursInDay, hours) => {
    let resultDate = new Date(startDay)

    let workDays = Math.floor(hours / hoursInDay)
    let hoursLeft = workDays === 0 ? hours : hours % (workDays * hoursInDay)

    let hoursResult = resultDate.getUTCHours() + hoursLeft
    if (hoursResult >= hoursInDay) {
      hoursResult -= hoursInDay
      workDays++
    }
    resultDate.setUTCHours(hoursResult)

    while (isNotWorking(resultDate)) {
      resultDate.setUTCDate(resultDate.getUTCDate() + 1)
    }
    for (let i = 0; i < workDays; i++) {
      resultDate.setUTCDate(resultDate.getUTCDate() + 1)
      while (isNotWorking(resultDate)) {
        resultDate.setUTCDate(resultDate.getUTCDate() + 1)
      }
    }

    return resultDate
  }


  class YtApi {
    token = ''

    getGantIdFromUrl(url) {
      return url.match(/gantt-charts\/(\d+-\d+)/)[1] ?? ''
    }

    getIssueFieldValue(issue, fieldName) {
      for (const fieldData of issue.fields) {
        const currentFieldName = fieldData.projectCustomField.field.localizedName ?? fieldData.projectCustomField.field.name
        if (currentFieldName === fieldName) {
          return fieldData.value
        }
      }

      return null
    }

    async request(uri, options) {
      if (this.token === '') {
        let k = 0
        while (window.localStorage.key(k) !== null) {
          let key = window.localStorage.key(k)

          if (key.indexOf('-token') !== -1) {
            this.token = JSON.parse(window.localStorage.getItem(key)).accessToken
            break
          }
          k++
        }
      }

      const sendingOptions = Object.assign({}, options)
      sendingOptions.headers = Object.assign({}, options?.headers ?? {}, { 'Authorization': 'Bearer ' + this.token})

      return fetch(uri, sendingOptions).then((resp) => resp.json())
    }

    async getIssues(query) {
      const fieldsText = 'fields=$type,attachments(id),commentsCount,created,fields($type,hasStateMachine,id,isUpdatable,name,localizedName,projectCustomField($type,bundle(id),canBeEmpty,emptyFieldText,field(fieldType(isMultiValue,valueType),id,localizedName,name,ordinal),id,isEstimation,isPublic,isSpentTime,ordinal,size),value($type,archived,avatarUrl,buildIntegration,buildLink,color(id),description,fullName,id,isResolved,localizedName,login,markdownText,minutes,name,presentation,ringId,text)),hasEmail,id,idReadable,links(direction,id,issuesSize,linkType(aggregation,directed,localizedName,localizedSourceToTarget,localizedTargetToSource,name,sourceToTarget,targetToSource,uid),trimmedIssues($type,comments($type),created,id,idReadable,isDraft,numberInProject,project(id,ringId),reporter(id),resolved,summary,voters(hasVote),votes,watchers(hasStar)),unresolvedIssuesSize),project($type,id,isDemo,leader(id),name,ringId,shortName),reporter($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),resolved,summary,tags(color(id),id,isUpdatable,isUsable,name,owner(id),query),transaction(authorId,timestamp),trimmedDescription,updated,updater($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),visibility($type,implicitPermittedUsers($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),permittedGroups($type,allUsersGroup,icon,id,name,ringId),permittedUsers($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId)),voters(hasVote),votes,watchers(hasStar)'

      return this.request('/api/issues?skip=0&top=500&query=' + encodeURIComponent(query) + '&' + fieldsText)
    }

    async getGantt(ganttId) {
      const fieldsText = 'fields=aggregationLink(aggregation,directed,id,localizedSourceToTarget,localizedTargetToSource,sourceToTarget,targetToSource),dependencyLink(aggregation,directed,id,localizedSourceToTarget,localizedTargetToSource,sourceToTarget,targetToSource),dependencyLinkOutward,estimationField(fieldType(id,isBundleType,presentation,valueType),id,name),estimationTimeUnit(id),fieldConstraint(prototype(id,name)),id,isRecalculating,isUpdatable,members(dependsOn(estimation,id,spentTime,startDate),estimation,fieldConstraint(value(id)),id,isParent,issue($type,attachments(id),commentsCount,created,fields($type,hasStateMachine,id,isUpdatable,name,localizedName,projectCustomField($type,bundle(id),canBeEmpty,emptyFieldText,field(fieldType(isMultiValue,valueType),id,localizedName,name,ordinal),id,isEstimation,isPublic,isSpentTime,ordinal,size),value($type,archived,avatarUrl,buildIntegration,buildLink,color(id),description,fullName,id,isResolved,localizedName,login,markdownText,minutes,name,presentation,ringId,text)),hasEmail,id,idReadable,links(direction,id,issuesSize,linkType(aggregation,directed,localizedName,localizedSourceToTarget,localizedTargetToSource,name,sourceToTarget,targetToSource,uid),trimmedIssues($type,comments($type),created,id,idReadable,isDraft,numberInProject,project(id,ringId),reporter(id),resolved,summary,voters(hasVote),votes,watchers(hasStar)),unresolvedIssuesSize),project($type,id,isDemo,leader(id),name,ringId,shortName),reporter($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),resolved,summary,tags(color(id),id,isUpdatable,isUsable,name,owner(id),query),transaction(authorId,timestamp),updated,updater($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),visibility($type,implicitPermittedUsers($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId),permittedGroups($type,allUsersGroup,icon,id,name,ringId),permittedUsers($type,avatarUrl,email,fullName,id,isLocked,issueRelatedGroup(icon),login,name,online,profiles(general(trackOnlineStatus)),ringId)),voters(hasVote),votes,watchers(hasStar)),parent(estimation,id,spentTime,startDate),spentTime,startDate),name,projects(id,name,ringId,shortName),readSharingSettings(permittedGroups(allUsersGroup,icon,id,name,ringId),permittedUsers(avatarUrl,email,fullName,guest,id,issueRelatedGroup(icon),login,ringId)),startDate,startDateField(fieldType(id,isBundleType,presentation,valueType),id,name),status(errors(field,id,messages),warnings(field,id,messages)),timezone(id,offset,presentation),updateSharingSettings(permittedGroups(allUsersGroup,icon,id,name,ringId),permittedUsers(avatarUrl,email,fullName,guest,id,issueRelatedGroup(icon),login,ringId)),userSettings(scale(id)),wipConstraint(wipLimit)'

      return this.request('/api/gantts/' + ganttId + '?$top=-1&' + fieldsText)
    }

    async changeGanttMembersOrder(ganttId, group, members) {
      let uri = '/api/gantts/' + ganttId + '/members'
      let method = 'POST'
      let sendData

      if (group != null) {
        uri += '/' + group
        sendData = { childMembers: [] }
        members.forEach((member) => {
          sendData.childMembers.push({ id: member.id })
        })
      } else {
        sendData = []
        members.forEach((member) => {
          sendData.push({ id: member.id })
        })
        method = 'PUT'
      }

      return this.request(uri, {
        method: method,
        headers: {
          'Content-Type':	'application/json;charset=utf-8',
        },
        body: JSON.stringify(sendData)
      })
    }

    async updateGanttMember(ganttId, memberDataForUpdate) {
      const uri = '/api/gantts/' + ganttId + '/members/' + memberDataForUpdate.id

      return this.request(uri, {
        method: 'POST',
        headers: {
          'Content-Type':	'application/json;charset=utf-8',
        },
        body: JSON.stringify(memberDataForUpdate)
      })
    }
  }


  const YtApiService = new YtApi()

  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  waitForElm('div[data-test="chart-body"] div[data-test="bar"]').then(async (elm) => {
    const ganttButtonGroup = document.querySelector('div[data-test="gantt-toolbar"] div:nth-child(2)')
    const recalculateOrigButton = ganttButtonGroup.querySelector('span:nth-child(1) button')
    const realRecalcButton = document.createElement("button")
    realRecalcButton.textContent = 'Real recalculate'
    realRecalcButton.classList = recalculateOrigButton.classList

    const onRecalcHandler = async () => {
      const ganttId = YtApiService.getGantIdFromUrl(location.pathname)
      const ganttData = await YtApiService.getGantt(ganttId)

     // get gantt members as tree
     const ganttMembersMap = new Map()
     const ganttMembersTree = []
     for (const gaanttMember of ganttData.members) {
       const expandedGanttMember = Object.assign({}, gaanttMember, { childs: [] })
       ganttMembersMap.set(expandedGanttMember.id, expandedGanttMember)
       if (gaanttMember.parent == null) {
         ganttMembersTree.push(expandedGanttMember)
       } else {
         ganttMembersMap.get(expandedGanttMember.parent.id).childs.push(expandedGanttMember)
       }
     }

      ganttMembersMap.clear()

      // sort gantt members by priority
      const sortiingQueue = [ganttMembersTree]
      let i = 10
      while(sortiingQueue.length > 0) {
        const arrForSort = sortiingQueue.shift()
        arrForSort.sort((a, b) => {
          const aPriority = YtApiService.getIssueFieldValue(a.issue, CONFIG_PRIORITY_FIELD_NAME)
          const bPrioirity = YtApiService.getIssueFieldValue(b.issue, CONFIG_PRIORITY_FIELD_NAME)

          return bPrioirity - aPriority
        })
        for (const ganttMember of arrForSort) {
          if (ganttMember.childs.length > 0) {
            sortiingQueue.push(ganttMember.childs)
          }
        }

        if (i-- === 0) break
      }

      // create priority groups for updating and inline version of tree
      const inlineGanttMembersTree = []
      const priorityGroups = []
      const fillPriorityGroups = (resultArray, members, parent) => {
        const groupNumber = resultArray.length

        for (const member of members) {
          inlineGanttMembersTree.push(member)
          if (resultArray[groupNumber] == null) {
            resultArray[groupNumber] = {parent: parent, childs: []}
          }

          resultArray[groupNumber].childs.push(member)
          if (member.childs.length > 0) {
            fillPriorityGroups(resultArray, member.childs, member)
          }
        }
      }
      fillPriorityGroups(priorityGroups, ganttMembersTree)

      const promises = []
      priorityGroups.forEach((priorityGroup) => {
        promises.push(YtApiService.changeGanttMembersOrder(ganttId, priorityGroup.parent?.id, priorityGroup.childs))
      })

      //Start date calculating
      const startDate = ganttData.startDate ?? new Date().getTime()
      const wipConstraint = ganttData.wipConstraint.wipLimit ?? 1

      const nextStartDates = []
      for (i = 0; i < wipConstraint; i++) {
        //todo there is bug if startDate is not working
        nextStartDates.push(startDate)
      }
      const currentStream = 1
      inlineGanttMembersTree.forEach((member, i) => {
        if (member.isParent) {
          member.startDate = nextStartDates[0]
          promises.push(YtApiService.updateGanttMember(ganttId, {id: member.id, startDate: member.startDate}))

          return
        }

        const nextStartDate = nextStartDates.shift()
        member.startDate = nextStartDate
        promises.push(YtApiService.updateGanttMember(ganttId, {id: member.id, startDate: member.startDate}))

        let spentTime = Math.ceil((member.spentTime > member.estimation ? member.spentTime : (member.issue.resolved != null ? member.spentTime : member.estimation)) / 60)
        const endDate = addWorkingTime(nextStartDate, CONFIG_HOURS_IN_DAY, spentTime).getTime()

        nextStartDates.push(endDate)
        nextStartDates.sort()
      })

      Promise.all(promises).then(() => location.reload())
    }

    realRecalcButton.addEventListener('click', onRecalcHandler, false)
    ganttButtonGroup.prepend(realRecalcButton)
  })
})()
