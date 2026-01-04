// ==UserScript==
// @name         Jira child issues without swimlanes
// @namespace    ydushko/jira-child-issues-without-swimlanes
// @version      0.6
// @description  Show child issues inline without swimlanes in next-gen JIRA projects on grouping None
// @author       Yaroslav Dushko
// @match        https://*.atlassian.net/jira/software/projects/*/boards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411839/Jira%20child%20issues%20without%20swimlanes.user.js
// @updateURL https://update.greasyfork.org/scripts/411839/Jira%20child%20issues%20without%20swimlanes.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(async function() {
    'use strict';

    function log(msg) {
        console.log('[JiraChildIssues]', msg);
    }

    function appendStyles() {
        const styleEl = document.createElement('style');
        styleEl.innerText = `
a.parent-link, a.child-link {
    color: inherit;
}
a.parent-link:hover, a.child-link:hover {
    color: inherit;
    text-decoration: none;
}
.wrapper-card {
    display: inline-block;
    border-radius: 3px;
    padding: 3px;
    background: #e3e4e6;
    box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px, rgba(23, 43, 77, 0.2) 0px 0px 1px;
    margin: 2px 0;
    cursor: pointer;
    width: calc(100% - 6px);
}
.wrapper-card .head, .wrapper-card .head div {
    display: flex;
    flex-direction: row;
    padding: 3px;
    align-items: center;
}
.child-card {
    background: white;
    border-radius: 3px;
    box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px, rgba(23, 43, 77, 0.2) 0px 0px 1px;
    padding: 12px 9px;
    display: flex;
    flex-direction: column;
}
.child-card:hover {
    background: rgb(244, 245, 247);
}
.child-card .footer, .child-card .footer div {
    margin-top: 6px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.issue-type {
    margin-right: 6px;
}
.issue-key {
    font-size: 12px;
    font-weight: 600;
    color: rgb(122, 134, 154);
}
.assignee {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin: 0 0 0 6px !important;
}
.estimate {
    background-color: rgb(223, 225, 230);
    color: rgb(23, 43, 77);
    border-radius: 2em;
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
    min-width: 1px;
    padding: 0.166667em 0.5em;
    text-align: center;
}
`;
        document.head.appendChild(styleEl);
    }
    appendStyles();

    async function fetchBoardData() {
        const boardId = window.location.pathname.split('/').slice(-1)[0];
        const gqlQuery = {
            operationName: 'SoftwareBoardScopeData',
            query: `
query SoftwareBoardScopeData($boardId: ID!) {
	boardScope(boardId: $boardId) {
		userSwimlaneStrategy
		board {
			assignees {
				accountId
				displayName
				avatarUrl
			}
			columns {
				id
				name
				maxIssueCount
				status {
					id
					name
				}
				columnStatus {
					status {
						id
						name
						category
					}
					transitions {
						id
						name
						status {
							id
						}
						originStatus {
							id
						}
						cardType {
							id
						}
						isGlobal
						isInitial
						hasConditions
					}
				}
				isDone
				isInitial
				transitionId
				cards {
					id
					flagged
					done
					parentId
					estimate {
						storyPoints
					}
					issue {
						id
						key
						summary
						labels
						assignee {
							accountId
							displayName
							avatarUrl
						}
						type {
							id
							name
							iconUrl
						}
						status {
							id
						}
					}
					coverMedia {
						attachmentId
						endpointUrl
						clientId
						token
						attachmentMediaApiId
						hiddenByUser
					}
					priority {
						name
						iconUrl
					}
					dueDate
					childIssuesMetadata {
						complete
						total
					}
				}
			}
			issueTypes {
				id
				name
				iconUrl
				hierarchyLevelType
			}
			inlineIssueCreate {
				enabled
			}
			cardMedia {
				enabled
			}
			issueChildren {
				id
				flagged
				done
				parentId
				estimate {
					storyPoints
				}
				issue {
					id
					key
					summary
					labels
					assignee {
						accountId
						displayName
						avatarUrl
					}
					type {
						id
						name
						iconUrl
					}
					status {
						id
					}
				}
				coverMedia {
					attachmentId
					endpointUrl
					clientId
					token
					attachmentMediaApiId
					hiddenByUser
				}
				priority {
					name
					iconUrl
				}
				dueDate
			}
			cards {
				id
			}
		}
		features {
			key
			status
			toggle
			category
		}
		projectLocation {
			id
			key
			name
			isSimplifiedProject
			issueTypes {
				id
				name
				iconUrl
				hierarchyLevelType
			}
		}
		issueParents {
			id
			key
			summary
			issue {
				status {
					id
				}
			}
			issueType {
				id
				name
				iconUrl
			}
			color
		}
	}
}`,
            variables: {
                boardId: boardId
            }
        };

        return fetch(`https://${window.location.host}/jsw/graphql?operation=SoftwareBoardScopeData`, {
            "headers": {
                "accept": "application/json,text/javascript,*/*",
                "content-type": "application/json",
            },
            "referrer": window.location.href,
            "referrerPolicy": "same-origin",
            "body": JSON.stringify(gqlQuery),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(
            (res) => res.json()
        );
    }

    async function onGroupByChange(cb){
        const groupByButton = document.querySelector('[data-test-id="software-board.header.controls-bar.swimlane-switch"] button')
        let groupBy = groupByButton.innerText;
        cb(groupBy);
        groupByButton.addEventListener('click', () => {
            setTimeout(() => {
                const dropdownItems = document.querySelectorAll('[data-test-id="software-board.header.controls-bar.swimlane-switch.dropdown-item"]');
                let dropdownClickListener = () => {
                    for (const item of dropdownItems) {
                        item.removeEventListener('click', dropdownClickListener);
                    }
                    setTimeout(() => {
                        groupBy = groupByButton.innerText;
                        cb(groupBy);
                    }, 1);
                };
                for (const item of dropdownItems) {
                    item.addEventListener('click', dropdownClickListener);
                }
            }, 1);
        });
    }

    onGroupByChange(async (groupBy) => {
        if (groupBy === 'None') {
            const data = await fetchBoardData();
            let statusColumns = {};
            let issueCards = {};
            for (const column of data.data.boardScope.board.columns) {
                const columnEl = document.querySelector('[data-rbd-droppable-id="COLUMN::' + column.id + '"]');
                statusColumns[column.status[0].id] = columnEl;
                for (const card of column.cards) {
                    issueCards[card.issue.id] = card;
                }
            }
            for (const child of data.data.boardScope.board.issueChildren) {
                const parent = issueCards[child.parentId];
                const parentEl = document.querySelector('[data-rbd-draggable-id="ISSUE::' + parent.issue.id + '"]');
                const columnEl = statusColumns[child.issue.status.id];
                const cardEl = document.createElement('div');
                let assigneeHtml = '';
                if (child.issue.assignee) {
                    assigneeHtml = `<img class="assignee" src="${child.issue.assignee.avatarUrl}" title="${child.issue.assignee.displayName}"/>`;
                }
                let estimateHtml = '';
                if (child.estimate.storyPoints) {
                    estimateHtml = `<span class="estimate">${child.estimate.storyPoints}</span>`;
                }
                cardEl.style.padding = '0px 4px';
                cardEl.innerHTML = `
<a class="parent-link" href="${window.location.pathname + '?selectedIssue=' + parent.issue.key}"><div class="wrapper-card">
      <div class="head">
          <div>
              <img class="issue-type" src="${parent.issue.type.iconUrl}" />
              <span class="issue-key">${parent.issue.key}</span>
          </div>
      </div>
      <a class="child-link" href="${window.location.pathname + '?selectedIssue=' + child.issue.key}"><div class="child-card">
          <div>${child.issue.summary}</div>
          <div class="footer">
              <div>
                  <img class="issue-type" src="${child.issue.type.iconUrl}" />
                  <span class="issue-key">${child.issue.key}</span>
              </div>
              <div>
                  ${estimateHtml}
                  ${assigneeHtml}
              </div>
          </div>
     </div></a>
</div></a>`;
                columnEl.prepend(cardEl);
            }
        }
    });
})();