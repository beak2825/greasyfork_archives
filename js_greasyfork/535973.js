// ==UserScript==
// @name         SpringerHelper Reviewer Finder
// @namespace    com.springernature.script
// @version      2.2.1
// @description  Display potential reviewers in a popup with "Add to shortlist" buttons
// @match        *://reviewer-finder.springernature.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.springernature.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535973/SpringerHelper%20Reviewer%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/535973/SpringerHelper%20Reviewer%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let modalInstance = null;

    function getText(parent, selector) {
        const el = parent.querySelector(selector);
        return el ? el.textContent.trim() : '';
    }

    function extractMetricsFromLis(el) {
        const liElements = el.querySelectorAll('li');
        const metrics = {};
        liElements.forEach(li => {
            const label = li.querySelector('.c-reviewer-metric--details--text')?.textContent.trim();
            const value = li.querySelector('.c-reviewer-metric--details--stats')?.textContent.trim();
            if (!label || !value) return;
            if (label.includes("H-index")) metrics.hIndex = value;
            else if (label.includes("Pubs") && label.includes("5")) metrics.pubs5y = value;
            else if (label.includes("citations")) metrics.citations = value;
            else if (label.includes("Invitations to review")) metrics.invites = value;
            else if (label.includes("Invite acceptance rate")) metrics.acceptRate = value;
            else if (label.includes("Report delivery rate")) metrics.deliveryRate = value;
            else if (label.includes("Avg. days to complete a review")) metrics.avgDays = value;
            else if (label.includes("Reviews in progress")) metrics.inProgress = value;
        });
        return metrics;
    }

    function parseReviewer(el, index) {
        const metrics = extractMetricsFromLis(el);
        const form = el.querySelector('form[action*="addReviewerToShortlist"]');
        const addForm = el.querySelector('form[id*="add_to_list_form"]');
        return {
            index,
            name: getText(el, '.c-reviewer-contact-details__name'),
            email: getText(el, '.c-reviewer-contact-details__email'),
            institution: getText(el, '.c-reviewer-contact-details__affiliation--link'),
            hIndex: metrics.hIndex || '',
            pubs5y: metrics.pubs5y || '',
            citations: metrics.citations || '',
            invites: metrics.invites || '',
            acceptRate: metrics.acceptRate || '',
            deliveryRate: metrics.deliveryRate || '',
            avgDays: metrics.avgDays || '',
            inProgress: metrics.inProgress || '',
            addForm: addForm,
            form: form
        };
    }

    function createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const key in attrs) {
            if (key === 'style') Object.assign(el.style, attrs[key]);
            else if (key.startsWith('on')) el.addEventListener(key.substring(2), attrs[key]);
            else el.setAttribute(key, attrs[key]);
        }
        children.forEach(child => {
            el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
        return el;
    }

    function showModal(reviewers) {
        if (modalInstance) {
            modalInstance.remove();
            modalInstance = null;
            return;
        }

        const modal = createElement("div", {
            id: "reviewer-modal",
            style: {
                position: "fixed",
                top: "10%",
                left: "5%",
                width: "90%",
                height: "80%",
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                zIndex: "9999",
                overflow: "auto",
                padding: "20px",
                fontFamily: "Arial, sans-serif"
            }
        });

        modalInstance = modal;

        const headers = [
            "#", "Name", "Email", "Institution", "H-index", "Pubs (5y)", "Citations",
            "Invites", "Accept %", "Delivery %", "Avg Days", "In Progress", "Add to List", "Select"
        ];

        const visibleColumns = headers.map(() => true); // 初始所有列都可见
        visibleColumns[2] = false; // 初始隐藏第 3 列 (Email)
        // visibleColumns[3] = false; // 初始隐藏第 4 列 (Institution)
        // console.log(visibleColumns);

        const controlPanel = createElement("div", {
            style: {
                marginBottom: "10px",
                fontSize: "14px"
            }
        }, headers.map((header, i) =>
                       createElement("label", { style: { marginRight: "10px" } }, [
            createElement("input", {
                type: "checkbox",
                checked: true,
                onchange: (e) => {
                    visibleColumns[i] = e.target.checked;
                    updateTableColumnVisibility();
                }
            }),
            ` ${header}`
        ])
        ));
        modal.appendChild(controlPanel);

        const closeButton = createElement("button", {
            style: { float: "right", marginBottom: "10px" },
            onclick: () => {
                modal.remove();
                modalInstance = null;
            }
        }, ["Close"]);

        const table = createElement("table", {
            style: { width: "100%", borderCollapse: "collapse", fontSize: "20px" }
        });

        const thead = createElement("thead", {}, [
            createElement("tr", {}, headers.map((h, i) =>
                createElement("th", {
                    style: {
                        display: visibleColumns[i] ? "" : "none",
                        border: "1px solid #ddd",
                        padding: "12px",
                        backgroundColor: "#eee",
                        cursor: "pointer"
                    },
                    onclick: () => sortTable(i),
                    'data-col-index': i,
                }, [h])
            ))
        ]);
        table.appendChild(thead);

        const tbody = createElement("tbody", {}, reviewers.map((r, i) => {
            // 每次 clone form（不要放在 parseReviewer 中）
            let clonedAddForm = null;
            if (r.addForm) {
                clonedAddForm = r.addForm.cloneNode(true);
                clonedAddForm.style.margin = "0";
                clonedAddForm.style.padding = "0";
                clonedAddForm.style.display = "inline"; // 避免被 block 弄乱布局
            }

            return createElement("tr", {}, [
                createElement("td", { style: { textAlign: "center", display: visibleColumns[0] ? "" : "none" }, 'data-col-index': 0 }, [(i + 1).toString()]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[1] ? "" : "none" }, 'data-col-index': 1 }, [r.name]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[2] ? "" : "none" }, 'data-col-index': 2 }, [r.email]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[3] ? "" : "none" }, 'data-col-index': 3 }, [r.institution]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[4] ? "" : "none" }, 'data-col-index': 4 }, [r.hIndex]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[5] ? "" : "none" }, 'data-col-index': 5 }, [r.pubs5y]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[6] ? "" : "none" }, 'data-col-index': 6 }, [r.citations]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[7] ? "" : "none" }, 'data-col-index': 7 }, [r.invites]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[8] ? "" : "none" }, 'data-col-index': 8 }, [r.acceptRate]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[9] ? "" : "none" }, 'data-col-index': 9 }, [r.deliveryRate]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[10] ? "" : "none" }, 'data-col-index': 10 }, [r.avgDays]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[11] ? "" : "none" }, 'data-col-index': 11 }, [r.inProgress]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[12] ? "" : "none" }, 'data-col-index': 12 }, [
                    clonedAddForm || createElement("span", {}, ["N/A"])
                ]),
                createElement("td", { style: { textAlign: "center", display: visibleColumns[13] ? "" : "none" }, 'data-col-index': 13 }, [
                    createElement("input", { type: "checkbox", "data-index": r.index })
                ])

            ]);
        }));
        table.appendChild(tbody);

        const batchBtn = createElement("button", {
                style: {
                    position: "sticky",
                    float: "right",
                    marginTop: "20px",
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)" // 可选：添加阴影提升层次感
                },
            onclick: () => {
                const selected = tbody.querySelectorAll('input[type="checkbox"]:checked');
                if (selected.length === 0) return alert("No reviewers selected.");

                let count = 0;

                selected.forEach(cb => {
                    const idx = parseInt(cb.getAttribute("data-index"));
                    const origForm = reviewers[idx].form;
                    if (!origForm) return;

                    const clonedForm = origForm.cloneNode(true);
                    const iframeName = `iframe-${Date.now()}-${Math.random().toString(36).substr(2)}`;
                    const iframe = createElement("iframe", {
                        name: iframeName,
                        style: { display: "none" }
                    });

                    clonedForm.setAttribute("target", iframeName);
                    clonedForm.style.display = "none";

                    document.body.appendChild(iframe);
                    document.body.appendChild(clonedForm);

                    // 防止表单数据为空
                    if (!clonedForm.querySelector('input[name]')) return;

                    setTimeout(() => {
                        clonedForm.submit();
                        count++;
                        console.log(`Submitted: ${reviewers[idx].name}`);
                    }, 100); // 节流提交
                });

                alert(`Submitted ${selected.length} reviewers to shortlist.`);
                setTimeout(() => {
                    location.reload();
                }, 500); // 0.5 秒后刷新页面
            }
        }, ["Add to shortlist"]);

        modal.appendChild(closeButton);
        modal.appendChild(table);
        modal.appendChild(batchBtn);
        document.body.appendChild(modal);

        updateTableColumnVisibility(); // 打开页面时先更新一下列显示状态
        resetControlCheckboxes(); // 重置 control Panel 的勾选状态

        // 排序列，按类型进行字符串/数值排序
        function sortTable(colIndex) {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const asc = tbody.getAttribute("data-sort") !== `col-${colIndex}-asc`;
            tbody.setAttribute("data-sort", `col-${colIndex}-${asc ? 'asc' : 'desc'}`);

            // 自动检测数值类型的正则表达式
            const numericPattern = /^[+-]?\d{1,3}(,\d{3})*(\.\d+)?%?$|^[+-]?\d+\.?\d*%?$/;

            // 检测列是否为数值类型
            const isNumericColumn = rows.some(row => {
                const content = row.children[colIndex].textContent.trim();
                return numericPattern.test(content);
            });

            rows.sort((a, b) => {
                const getNumericValue = (str) => {
                    // 移除逗号、百分号等非数字字符（保留小数点和负号）
                    const numStr = str.replace(/,|%|$/g, '');
                    const num = parseFloat(numStr);

                    // 处理百分比值（假设百分比列的值类似 95%）
                    if (str.includes('%')) return num / 100;

                    return isNaN(num) ? 0 : num;
                };

                const valA = a.children[colIndex].textContent.trim();
                const valB = b.children[colIndex].textContent.trim();

                if (isNumericColumn) {
                    const numA = getNumericValue(valA);
                    const numB = getNumericValue(valB);
                    return asc ? numA - numB : numB - numA;
                }

                // 普通字符串排序
                return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });

            rows.forEach(row => tbody.appendChild(row));
        }

        // 控制列的显示状态
        function updateTableColumnVisibility() {
            const allCells = modal.querySelectorAll("th, td");
            allCells.forEach(cell => {
                const col = parseInt(cell.getAttribute("data-col-index"));
                if (!isNaN(col)) {
                    cell.style.display = visibleColumns[col] ? "" : "none";
                }
            });
        }
        // 重置 control Panel 的勾选状态
        function resetControlCheckboxes() {
            const checkboxes = controlPanel.querySelectorAll('input');
            checkboxes.forEach((cb, i) => {
                cb.checked = visibleColumns[i];
            });
        }
    }

    // 查找符合要求的块
    function getReviewerNodes() {
        return document.querySelectorAll(
            '.row.c-reviewer--panel.no-shadow-border-only.c-no-coi:not(.c-reviewer--panel__added-to-list)'
        );
    }

    // 更新按钮文本为当前数量
    function updateButtonText() {
        const count = getReviewerNodes().length;
        triggerBtn.textContent = `Show ${count} Potential Reviewers`;
    }

    // 显示表格
    function extractAndShow() {
        const nodes = getReviewerNodes();
        updateButtonText(); // 更新按钮文本为当前数量
        if (nodes.length === 0) return alert("No reviewer panels found.");
        const reviewers = Array.from(nodes).map((el, i) => parseReviewer(el, i));
        showModal(reviewers);
    }

    // Create floating button
    const initialCount = getReviewerNodes().length;
    const triggerBtn = createElement("button", {
        style: {
            position: "fixed",
            bottom: "40px",
            right: "20px",
            zIndex: "9999",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        },
        onclick: extractAndShow
    }, [`Show ${initialCount} Potential Reviewers`]);

    document.body.appendChild(triggerBtn);
})();