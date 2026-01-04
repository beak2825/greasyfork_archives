// ==UserScript==
// @name         Google Classroom Student Reviewed Status
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allow students to visually indicate when they've reviewed any received feedback.
// @author       Dominic Chambers
// @match        https://classroom.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402499/Google%20Classroom%20Student%20Reviewed%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/402499/Google%20Classroom%20Student%20Reviewed%20Status.meta.js
// ==/UserScript==

/*
  Google Classroom URL Structure:

  - /u/1/h (Home)
  - /u/1/c/<class-id> (Classroom)
  - /u/1/c/<class-id>/a/<assignment-id>/details (Assignment Details)
  - /u/1/c/<class-id>/sp/<student-id>/all (View All)
  - /u/1/c/<class-id>/sp/<student-id>/as (View All -- Assigned)
  - /u/1/c/<class-id>/sp/<student-id>/g (View All -- Returned with grade)
  - /u/1/c/<class-id>/sp/<student-id>/m (View All -- Missing)
*/

(() => {
    'use strict';

    console.log("'Google Classroom Student Reviewed Status' extension loaded")

    const observer = new MutationObserver((mutations) => {
        const annotationProcessor = (location.pathname.endsWith('/all') || location.pathname.endsWith('/g')) ?
              annotateViewAllPage : (location.pathname.endsWith('/details')) ?
                    annotateAssignmentDetailsPage : null

        if (annotationProcessor) {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(annotationProcessor)
            })
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const annotateViewAllPage = (node) => {
        const assignmentLinks = Array.from(node.getElementsByTagName('a')).filter(a => a.pathname.endsWith('/details'))

        assignmentLinks.forEach((assignmentLink) => {
            const returnedTick = Array.from(parentRow(assignmentLink).querySelectorAll('div[role=heading] span[aria-hidden]')).filter(e => e.textContent === '')[0]

            if (returnedTick) {
                const { assignmentId, classId } = parseAssignmentDetailsPageUrl(assignmentLink.pathname)
                const isReviewed = localStorage.getItem(reviewedStatusKey(assignmentId, classId)) === 'true'

                if (isReviewed) {
                    returnedTick.textContent = ''
                }
            }
        })
    }

    const annotateAssignmentDetailsPage = (node) => {
        const statusElem = node.textContent === 'Returned' && node.offsetWidth > 0 ? node : null

        if (statusElem) {
            const { assignmentId, classId } = parseAssignmentDetailsPageUrl(location.pathname)
            const resubmitButton = button('Resubmit')
            const addOrCreateButton = button('Add or create')
            const reviewedButton = document.createElement('div')
            const primaryButtonStyle = resubmitButton.className
            const secondaryButtonStyle = addOrCreateButton.className
            let isReviewed = localStorage.getItem(reviewedStatusKey(assignmentId, classId)) === 'true'

            reviewedButton.setAttribute('role', 'button')
            resubmitButton.className = secondaryButtonStyle
            resubmitButton.querySelector('span > span').style = 'width: 100%'

            const updateButtons = () => {
                statusElem.textContent = isReviewed ? 'Reviewed' : 'Returned'
                reviewedButton.textContent = isReviewed ? 'Unreview' : 'Mark as Reviewed'
                reviewedButton.className = isReviewed ? secondaryButtonStyle : primaryButtonStyle

                if (isReviewed) {
                    resubmitButton.style = 'display: none'
                } else {
                    resubmitButton.style = 'display: block; margin: 8px 0 0'
                }
            }

            reviewedButton.onclick = () => {
                isReviewed = !isReviewed
                updateButtons()
                localStorage.setItem(reviewedStatusKey(assignmentId, classId), isReviewed)
            }

            updateButtons()
            resubmitButton.parentNode.parentNode.insertBefore(reviewedButton, resubmitButton.parentNode)
        }
    }

    const parentRow = elem => elem.getAttribute('role') === 'region' ? elem.parentNode : parentRow(elem.parentNode)

    const button = (name) => Array.from(document.querySelectorAll('aside[role=complementary] *[role=button]')).filter(e => e.textContent.startsWith(name))[0]

    const reviewedStatusKey = (assignmentId, classId) => `reviewed-status:${assignmentId}:${classId}`

    const parseAssignmentDetailsPageUrl = path => {
        const [, assignmentId, , classId] = path.split('/').reverse()
        return { assignmentId, classId }
    }
})();
