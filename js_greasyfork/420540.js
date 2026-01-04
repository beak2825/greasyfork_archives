// ==UserScript==
// @name         清华大学GPA查询
// @namespace    https://blog.panda2134.site/
// @version      0.2
// @description  卷起来了 -- 本脚本可以在信息门户的【全部成绩】页面帮你计算出每个学期和总的必限、必限任GPA
// @author       You
// @match        http://zhjw.cic.tsinghua.edu.cn/cj.cjCjbAll.do?m=bks_yxkccj
// @match        https://webvpn.tsinghua.edu.cn/http/*/cj.cjCjbAll.do?m=bks_yxkccj
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420540/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6GPA%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420540/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6GPA%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function trimSpace(str) {
        return Array.from(str).filter(ch => !(/^\s$/.test(ch))).join('')
    }

    function calculateGPA(courseList) {
        let compulsoryAndElectiveCred = 0, compulsoryAndElectiveWeightedPoints = 0,
            allCred = 0, allWeightedPoints = 0;
        for (let item of courseList) {
            if (Number.isNaN(item.points)) {
                continue;
            }
            if(item.attr !== '任选') {
                compulsoryAndElectiveCred += item.credit; compulsoryAndElectiveWeightedPoints += item.points * item.credit;
            }
            allCred += item.credit; allWeightedPoints += item.points * item.credit;
        }

        const compulsoryAndElectiveGPA = compulsoryAndElectiveWeightedPoints / compulsoryAndElectiveCred
        const allGPA = allWeightedPoints / allCred
        return {compulsoryAndElectiveGPA, allGPA, allCred, allWeightedPoints,
                compulsoryAndElectiveCred, compulsoryAndElectiveWeightedPoints }
    }

    // main prog

    function main() {
        let courseData = []
        const lines = document.querySelectorAll('.table.table-striped.table-condensed > tbody > tr')

        for (let i = 1; i < lines.length && lines[i].children.length != 1; i++) {
            const courseName = lines[i].children[2].innerHTML
            const credit = parseInt(lines[i].children[3].children[0].innerHTML)
            const grade = trimSpace(lines[i].children[5].children[0].innerHTML)
            const points = parseFloat(trimSpace(lines[i].children[6].children[0].innerHTML))
            const attr = trimSpace(lines[i].children[8].children[0].innerHTML.substring(0, 10))
            const semester = lines[i].children[10].children[0].innerHTML
            const item = {courseName, credit, grade, points, attr, semester}
            courseData.push(item)
        }

        let GPABySemester = new Map(), totalGPA = {
            compulsoryAndElectiveCred: .0,
            compulsoryAndElectiveWeightedPoints: .0,
            allCred: .0, allWeightedPoints: .0
        }
        for (let i = 0, j = 0; i < courseData.length; i = j) {
            while (j < courseData.length && courseData[i].semester === courseData[j].semester) {
                j++;
            }
            const result = calculateGPA(courseData.slice(i, j))
            GPABySemester[courseData[i].semester] = [
                result.compulsoryAndElectiveGPA, result.allGPA
            ]
            for (let key in result) {
                if (key !== 'compulsoryAndElectiveGPA' && key !== 'allGPA') {
                    totalGPA[key] += result[key]
                }
            }
        }

        GPABySemester['总绩点'] = [
            totalGPA.compulsoryAndElectiveWeightedPoints / totalGPA.compulsoryAndElectiveCred,
            totalGPA.allWeightedPoints / totalGPA.allCred
        ]

        console.log(GPABySemester)

        const positionalElement = document.querySelector('a[name="top"]')
        const parentElement = positionalElement.parentElement

        const theTbody = document.createElement('tbody')

        const theHeaderRow = document.createElement('tr')

        const semesterTag = document.createElement('th')
        semesterTag.appendChild(document.createTextNode('学期'))
        theHeaderRow.appendChild(semesterTag)

        const compElecTag = document.createElement('th')
        compElecTag.appendChild(document.createTextNode('必限'))
        theHeaderRow.appendChild(compElecTag)

        const allCourseTag = document.createElement('th')
        allCourseTag.appendChild(document.createTextNode('必限任'))
        theHeaderRow.appendChild(allCourseTag)

        theTbody.appendChild(theHeaderRow)

        for (let key in GPABySemester) {
            const row = document.createElement('tr')
            const semesterTag = document.createElement('td')
            semesterTag.appendChild(document.createTextNode(key))
            row.appendChild(semesterTag)
            const compElecTag = document.createElement('td')
            compElecTag.appendChild(document.createTextNode(GPABySemester[key][0].toFixed(4)))
            row.appendChild(compElecTag)
            const allCourseTag = document.createElement('td')
            allCourseTag.appendChild(document.createTextNode(GPABySemester[key][1].toFixed(4)))
            row.appendChild(allCourseTag)
            theTbody.appendChild(row)
        }

        const theTable = document.createElement('table')
        theTable.className = "table table-striped table-condensed"
        theTable.appendChild(theTbody)
        parentElement.insertBefore(theTable, positionalElement)

    }


    main()
})();