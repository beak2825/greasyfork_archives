// ==UserScript==
// @name            AtCoder Standings Filtering by Group
// @name:en         AtCoder Standings Filtering by Group
// @namespace       http://tampermonkey.net/
// @version         1.1.0
// @description     お気に入りのみ表示がオンの時に、事前定義したユーザーグループで順位表をフィルタリングする機能を追加します。当該コンテストに参加していないお気に入りユーザーを非表示にする機能も含んでいます。
// @description:en  Filter AtCoder standings by predefined user groups when "Favorites Only" is enabled. Supports unregistered favorites hiding.
// @author          sorachandu
// @match           https://atcoder.jp/contests/*/standings*
// @match           https://atcoder.jp/settings/fav
// @exclude         https://atcoder.jp/contests/*/standings/json
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/544794/AtCoder%20Standings%20Filtering%20by%20Group.user.js
// @updateURL https://update.greasyfork.org/scripts/544794/AtCoder%20Standings%20Filtering%20by%20Group.meta.js
// ==/UserScript==

// 注: 当Scriptはほぼ全て GitHub Copilot Agent mode Claude Sonnet 4 に書いてもらっています.

/*
 * This script includes code derived from "AtCoder Standings Excluding Unrated User" by HalsSC
 * Original source: https://greasyfork.org/ja/scripts/472242-atcoder-standings-excluding-unrated-user
 * Licensed under MIT License
 * Copyright (c) HalsSC
 * 
 * Modifications made to work with filtered standings by checking the number of
 * td.standings-result elements instead of checking td.standings-rank content.
 */

(function() {
    'use strict';

    // グループデータを管理するためのローカルストレージキー
    const GROUPS_STORAGE_KEY = 'atcoder_user_groups';
    const GROUP_ORDER_STORAGE_KEY = 'atcoder_group_order';
    const FILTER_STATE_STORAGE_KEY = 'atcoder_filter_state';
    
    // 未登録ユーザー非表示の遅延時間（ミリ秒）
    const HIDE_UNREGISTERED_DELAY = 100;
    
    // 現在編集中のグループデータ
    let currentEditingGroup = null;
    let originalEditingGroup = null; // 元のグループデータを保持
    let isEditMode = false;
    let saveCompleted = false; // 保存完了フラグ
    
    // 元の統計情報を保持
    let originalFastestSolvers = null;
    let originalSolverCounts = null;
    
    // グループデータの初期化
    function initializeGroups() {
        const groups = localStorage.getItem(GROUPS_STORAGE_KEY);
        if (!groups) {
            localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify({}));
            return {};
        }
        return JSON.parse(groups);
    }

    // グループデータの保存
    function saveGroups(groups) {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    }

    // グループデータの取得
    function getGroups() {
        return JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) || '{}');
    }

    // グループ順序の保存
    function saveGroupOrder(order) {
        localStorage.setItem(GROUP_ORDER_STORAGE_KEY, JSON.stringify(order));
    }

    // グループ順序の取得
    function getGroupOrder() {
        const order = localStorage.getItem(GROUP_ORDER_STORAGE_KEY);
        if (!order) {
            const groups = getGroups();
            const defaultOrder = Object.keys(groups);
            saveGroupOrder(defaultOrder);
            return defaultOrder;
        }
        return JSON.parse(order);
    }

    // フィルター状態の保存
    function saveFilterState(state) {
        localStorage.setItem(FILTER_STATE_STORAGE_KEY, JSON.stringify(state));
    }

    // フィルター状態の取得
    function getFilterState() {
        const state = localStorage.getItem(FILTER_STATE_STORAGE_KEY);
        if (!state) {
            return {
                noneChecked: true,
                selectedGroups: [],
                operation: 'OR',
                hideUnregistered: true
            };
        }
        
        const filterState = JSON.parse(state);
        
        // 現在存在するグループのみに絞り込む
        const currentGroups = getGroups();
        const existingGroupNames = Object.keys(currentGroups);
        const originalSelectedGroups = filterState.selectedGroups || [];
        const validSelectedGroups = originalSelectedGroups.filter(groupName => 
            existingGroupNames.includes(groupName)
        );
        
        // 削除されたグループがあった場合の処理
        if (originalSelectedGroups.length !== validSelectedGroups.length) {
            // 有効なグループがなくなった場合はNoneに戻す
            if (validSelectedGroups.length === 0 && originalSelectedGroups.length > 0) {
                filterState.noneChecked = true;
                filterState.selectedGroups = [];
            } else {
                filterState.selectedGroups = validSelectedGroups;
            }
            
            // 更新された状態を保存
            saveFilterState(filterState);
        }
        
        // hideUnregisteredのデフォルト値を追加
        if (typeof filterState.hideUnregistered === 'undefined') {
            filterState.hideUnregistered = true;
        }
        
        return filterState;
    }

    // お気に入りユーザー一覧を取得
    function getFavoriteUsers() {
        // AtCoderのページから var favs を取得
        if (typeof window.favs !== 'undefined') {
            return window.favs;
        }
        
        // スクリプトタグから取得を試みる
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent;
            const match = content.match(/var\s+favs\s*=\s*(\[.*?\]);/s);
            if (match) {
                try {
                    return JSON.parse(match[1]);
                } catch (e) {
                    console.error('お気に入りユーザーのパースに失敗:', e);
                }
            }
        }
        
        console.warn('お気に入りユーザー一覧が見つかりません');
        return [];
    }

    /*
     * The following function hideUnregisteredUsers is based on code from
     * "AtCoder Standings Excluding Unrated User" by HalsSC
     * Original source: https://greasyfork.org/ja/scripts/472242-atcoder-standings-excluding-unrated-user
     * Licensed under MIT License
     * Copyright (c) HalsSC
     * 
     * Uses the original logic of checking td.standings-rank content for "-"
     * to identify unregistered users.
     */
    
    // 順位表の中で参加登録していないユーザの行を非表示にする関数
    function hideUnregisteredUsers() {
        setTimeout(function() {
            const userRows = getUserRows();
            
            userRows.forEach(function(row) {
                // standings-rank要素をチェック
                const rankCell = row.querySelector('td.standings-rank');
                if (!rankCell) return;
                
                const rankText = rankCell.textContent.trim();
                
                // 順位が"-"の場合は未登録ユーザー
                if (rankText === "-") {
                    // FAに垢消しが含まれるとFA欄まで消えちゃう対策
                    if (row.className !== "standings-fa") {
                        row.hidden = true;
                    }
                }
            });
        }, HIDE_UNREGISTERED_DELAY);
    }

    // 未登録ユーザーの非表示を解除する関数
    function showUnregisteredUsers() {
        const hiddenRows = document.querySelectorAll("tr[hidden]");
        hiddenRows.forEach(function(row) {
            row.hidden = false;
        });
    }

    // FA行をスキップしてユーザー行のみを取得する共通関数
    function getUserRows(includeHidden = true) {
        const standingsTable = document.querySelector('#standings-tbody, .table tbody');
        if (!standingsTable) return [];
        
        const rows = standingsTable.querySelectorAll('tr');
        const userRows = [];
        
        rows.forEach(row => {
            // FA行（最速正解者行）をスキップ
            if (row.classList.contains('standings-fa')) return;
            
            // ユーザー行かどうかをチェック（リンクがあるかで判定）
            const userCell = row.querySelector('td a[href*="/users/"]');
            if (userCell && (includeHidden || !row.hidden)) {
                userRows.push(row);
            }
        });
        
        return userRows;
    }

    // お気に入り順位表を表示する共通関数
    function showFavoriteStandings() {
        const userRows = getUserRows();
        const visibleRows = [];
        
        userRows.forEach(row => {
            row.style.display = '';
            visibleRows.push(row);
        });
        
        // お気に入り順位表の統計を再計算
        updateFilteredStandings(visibleRows);
        
        return visibleRows;
    }

    // モーダルのスタイルを追加
    function addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .group-filter-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 10000;
                animation: fadeIn 0.3s;
            }
            
            .group-filter-modal.show {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .group-filter-modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 400px;
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                position: relative;
                margin: auto;
            }
            
            .group-filter-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
                color: #333;
            }
            
            .group-filter-option {
                margin: 10px 0;
                display: flex;
                align-items: center;
            }
            
            .group-filter-option input[type="checkbox"] {
                margin-right: 8px;
            }
            
            .group-filter-operation {
                margin: 20px 0;
                text-align: center;
            }
            
            .group-filter-operation input[type="radio"] {
                margin: 0 5px;
            }
            
            .group-filter-buttons {
                text-align: center;
                margin-top: 20px;
            }
            
            .group-filter-button {
                padding: 8px 16px;
                margin: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: #f8f9fa;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }
            
            .group-filter-button:hover {
                background-color: #e9ecef;
            }
            
            .filtering-by-group-btn {
                margin-left: 10px;
                padding: 5px 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .filtering-by-group-btn:hover {
                background-color: #0056b3;
            }
            
            .filtering-by-group-btn:disabled {
                background-color: #6c757d;
                cursor: not-allowed;
            }
            
            .clear-filtering-btn {
                margin-left: 10px;
                padding: 5px 10px;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .clear-filtering-btn:hover {
                background-color: #c82333;
            }
            
            .clear-filtering-btn:disabled {
                background-color: #6c757d;
                cursor: not-allowed;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Group Management Modal Styles */
            .group-manage-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 10000;
                animation: fadeIn 0.3s;
            }
            
            .group-manage-modal.show {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .group-manage-modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 600px;
                max-width: 95vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .group-manage-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
                color: #333;
            }
            
            .group-list {
                margin: 20px 0;
            }
            
            .group-item {
                display: flex;
                align-items: center;
                padding: 10px;
                border: 1px solid #e0e0e0;
                margin-bottom: 5px;
                border-radius: 4px;
                background-color: #f9f9f9;
                transition: background-color 0.2s;
            }
            
            .group-item.dragging {
                opacity: 0.5;
                background-color: #e9ecef;
            }
            
            .group-item.drag-over {
                background-color: #d1ecf1;
                border-color: #bee5eb;
            }
            
            .group-name {
                flex: 1;
                font-weight: bold;
            }
            
            .group-actions {
                display: flex;
                gap: 5px;
            }
            
            .group-action-btn {
                padding: 5px 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .group-edit-btn {
                background-color: #007bff;
                color: white;
            }
            
            .group-delete-btn {
                background-color: #dc3545;
                color: white;
            }
            
            .group-drag-btn {
                background-color: #6c757d;
                color: white;
                cursor: move;
            }
            
            .create-group-btn {
                width: 100%;
                padding: 10px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .manage-group-btn {
                margin-left: 10px;
                padding: 8px 16px;
                background-color: #17a2b8;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            /* Edit Group Modal Styles */
            .edit-group-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.7);
                display: none;
                z-index: 11000;
                animation: fadeIn 0.3s;
            }
            
            .edit-group-modal.show {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .edit-group-modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 800px;
                max-width: 95vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .edit-group-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                text-align: center;
                color: #333;
            }
            
            .edit-group-cols {
                display: flex;
                gap: 20px;
                margin: 20px 0;
            }
            
            .edit-group-col {
                flex: 1;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                padding: 10px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .edit-group-col-header {
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
                padding-bottom: 5px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .user-search-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 12px;
                box-sizing: border-box;
            }
            
            .user-search-input:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 3px rgba(0, 123, 255, 0.25);
            }
            
            .user-item {
                display: flex;
                align-items: center;
                padding: 5px;
                margin-bottom: 3px;
                border-radius: 3px;
            }
            
            .user-item.included {
                background-color: #d4edda;
            }
            
            .user-name {
                flex: 1;
                margin-left: 5px;
            }
            
            .user-action-btn {
                padding: 3px 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }
            
            .user-add-btn {
                background-color: #007bff;
                color: white;
            }
            
            .user-delete-btn {
                background-color: #dc3545;
                color: white;
            }
            
            .edit-group-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }
            
            .edit-group-save-btn {
                padding: 10px 20px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .edit-group-cancel-btn {
                padding: 10px 20px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            /* Group Name Modal Styles */
            .group-name-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.8);
                display: none;
                z-index: 12000;
                animation: fadeIn 0.3s;
            }
            
            .group-name-modal.show {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .group-name-modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 400px;
                max-width: 90vw;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .group-name-header {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                text-align: center;
                color: #333;
            }
            
            .group-name-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .group-name-ok-btn {
                width: 100%;
                padding: 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    // モーダルHTMLを作成
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'group-filter-modal';
        modal.id = 'groupFilterModal';
        
        modal.innerHTML = `
            <div class="group-filter-modal-content">
                <div class="group-filter-header">Filtering by Group</div>
                <div id="groupFilterOptions">
                    <div class="group-filter-option">
                        <input type="checkbox" id="noneFilter" checked>
                        <label for="noneFilter">None</label>
                    </div>
                </div>
                <div class="group-filter-operation">
                    <label><input type="radio" name="operation" value="OR" checked> OR</label>
                    <label><input type="radio" name="operation" value="AND"> AND</label>
                </div>
                <div class="group-filter-option">
                    <input type="checkbox" id="hideUnregistered">
                    <label for="hideUnregistered">Hide Unregistered User</label>
                </div>
                <div class="group-filter-buttons">
                    <button class="group-filter-button" onclick="closeGroupFilterModal()">Close</button>
                    <a href="https://atcoder.jp/settings/fav" target="_blank" class="group-filter-button">Manage Group</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // モーダル外をクリックで閉じる
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGroupFilterModal();
            }
        });
        
        return modal;
    }

    // Group管理モーダルを作成
    function createGroupManageModal() {
        const modal = document.createElement('div');
        modal.className = 'group-manage-modal';
        modal.id = 'groupManageModal';
        
        modal.innerHTML = `
            <div class="group-manage-modal-content">
                <div class="group-manage-header">Manage Groups</div>
                <button class="create-group-btn" onclick="openEditGroupModal(false)">Create Group</button>
                <div class="group-list" id="groupList"></div>
                <div class="group-filter-buttons">
                    <button class="group-filter-button" onclick="closeGroupManageModal()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // モーダル外をクリックで閉じる
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGroupManageModal();
            }
        });
        
        return modal;
    }

    // Edit Group モーダルを作成
    function createEditGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'edit-group-modal';
        modal.id = 'editGroupModal';
        
        modal.innerHTML = `
            <div class="edit-group-modal-content">
                <div class="edit-group-header" id="editGroupHeader">Create New Group</div>
                <div class="edit-group-cols">
                    <div class="edit-group-col">
                        <div class="edit-group-col-header">Favorite Users</div>
                        <input type="text" class="user-search-input" id="userSearchInput" placeholder="Search users..." autocomplete="off">
                        <div id="favoriteUsersList"></div>
                    </div>
                    <div class="edit-group-col">
                        <div class="edit-group-col-header">Group Members</div>
                        <div id="groupMembersList"></div>
                    </div>
                </div>
                <div class="edit-group-buttons">
                    <button class="edit-group-save-btn" onclick="saveEditGroup()">Save</button>
                    <button class="edit-group-cancel-btn" onclick="closeEditGroupModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Group名入力モーダルを作成
    function createGroupNameModal() {
        const modal = document.createElement('div');
        modal.className = 'group-name-modal';
        modal.id = 'groupNameModal';
        
        modal.innerHTML = `
            <div class="group-name-modal-content">
                <div class="group-name-header">Enter Group Name</div>
                <input type="text" class="group-name-input" id="groupNameInput" placeholder="">
                <button class="group-name-ok-btn" onclick="confirmGroupName()">OK</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    // Clear Filtering機能
    window.clearFiltering = function() {
        // フィルター状態をNoneに設定
        const filterState = {
            noneChecked: true,
            selectedGroups: [],
            operation: 'OR',
            hideUnregistered: true
        };
        saveFilterState(filterState);
        
        // お気に入りのみ表示がオンの場合のみフィルタリングを適用
        const favCheckbox = document.getElementById("checkbox-fav-only");
        if (favCheckbox && favCheckbox.checked) {
            // 元の統計情報を保存
            saveOriginalStatistics();
            
            // お気に入り順位表を表示（統計は再計算）
            showFavoriteStandings();
        } else {
            // お気に入りのみ表示がオフの場合は元の統計情報を復元
            restoreOriginalStatistics();
        }
    };

    // モーダルを開く
    function openGroupFilterModal() {
        const modal = document.getElementById('groupFilterModal');
        if (modal) {
            updateModalContent();
            modal.classList.add('show');
        }
    }

    // モーダルを閉じる（グローバルに定義）
    window.closeGroupFilterModal = function() {
        const modal = document.getElementById('groupFilterModal');
        if (modal) {
            // フィルター状態を保存
            const noneChecked = document.getElementById('noneFilter').checked;
            const selectedGroups = [];
            const groupCheckboxes = modal.querySelectorAll('input[data-group]:checked');
            groupCheckboxes.forEach(cb => {
                selectedGroups.push(cb.dataset.group);
            });
            const operation = modal.querySelector('input[name="operation"]:checked').value;
            const hideUnregistered = document.getElementById('hideUnregistered').checked;
            
            saveFilterState({
                noneChecked: noneChecked,
                selectedGroups: selectedGroups,
                operation: operation,
                hideUnregistered: hideUnregistered
            });
            
            modal.classList.remove('show');
            applyFiltering();
            
            // Clear ボタンの状態を更新
            setTimeout(() => {
                const clearBtn = document.querySelector('.clear-filtering-btn');
                if (clearBtn) {
                    const filterState = getFilterState();
                    const favCheckbox = document.getElementById("checkbox-fav-only");
                    const isFavChecked = favCheckbox && favCheckbox.checked;
                    const isNoneSelected = filterState.noneChecked || filterState.selectedGroups.length === 0;
                    clearBtn.disabled = !isFavChecked || isNoneSelected;
                }
            }, 100);
        }
    };

    // Group管理モーダルを開く
    window.openGroupManageModal = function() {
        const modal = document.getElementById('groupManageModal');
        if (modal) {
            updateGroupList();
            modal.classList.add('show');
        }
    };

    // Group管理モーダルを閉じる
    window.closeGroupManageModal = function() {
        const modal = document.getElementById('groupManageModal');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    // Edit Groupモーダルを開く
    window.openEditGroupModal = function(editMode, groupName = null) {
        isEditMode = editMode;
        const groups = getGroups();
        currentEditingGroup = editMode ? [...groups[groupName]] : [];
        originalEditingGroup = editMode ? [...groups[groupName]] : []; // 元のデータを保持
        saveCompleted = false; // フラグをリセット
        
        const modal = document.getElementById('editGroupModal');
        if (modal) {
            const header = document.getElementById('editGroupHeader');
            header.textContent = editMode ? `Edit Group: ${groupName}` : 'Create New Group';
            
            updateEditGroupContent();
            modal.classList.add('show');
        }
    };

    // Edit Groupモーダルを閉じる
    window.closeEditGroupModal = function() {
        // 保存が完了している場合は確認ダイアログを表示しない
        if (!saveCompleted) {
            // 変更があるかチェック
            const hasChanges = !arraysEqual(currentEditingGroup, originalEditingGroup);
            
            if (hasChanges) {
                if (!confirm('変更が保存されていません。変更を破棄してもよろしいですか？')) {
                    return; // キャンセルされた場合は閉じない
                }
            }
        }
        
        const modal = document.getElementById('editGroupModal');
        if (modal) {
            modal.classList.remove('show');
            currentEditingGroup = null;
            originalEditingGroup = null;
            isEditMode = false;
            saveCompleted = false; // フラグをリセット
        }
    };

    // 配列が等しいかチェックするヘルパー関数
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
    }

    // Edit Groupを保存
    window.saveEditGroup = function() {
        openGroupNameModal();
    };

    // Group名入力モーダルを開く
    function openGroupNameModal() {
        const modal = document.getElementById('groupNameModal');
        const input = document.getElementById('groupNameInput');
        
        if (isEditMode) {
            const header = document.getElementById('editGroupHeader').textContent;
            const currentName = header.replace('Edit Group: ', '');
            input.placeholder = currentName;
            input.value = '';
        } else {
            input.placeholder = '';
            input.value = '';
        }
        
        modal.classList.add('show');
        input.focus();
    }

    // Group名を確認
    window.confirmGroupName = function() {
        const input = document.getElementById('groupNameInput');
        let groupName = input.value.trim();
        
        // 空白の場合はplaceholderを使用
        if (!groupName && isEditMode) {
            groupName = input.placeholder;
        }
        
        // バリデーション
        if (!groupName) {
            alert('Group name cannot be empty. Please enter a valid name.');
            return;
        }
        
        const groups = getGroups();
        const existingNames = Object.keys(groups);
        
        // 編集モードでない場合、または名前が変更された場合の重複チェック
        if (!isEditMode || (isEditMode && input.placeholder !== groupName)) {
            if (existingNames.includes(groupName)) {
                alert(`Group name "${groupName}" already exists. Please choose a different name.`);
                return;
            }
        }
        
        // グループを保存
        const newGroups = {...groups};
        
        if (isEditMode) {
            const oldName = input.placeholder;
            delete newGroups[oldName];
            
            // 順序も更新
            const order = getGroupOrder();
            const index = order.indexOf(oldName);
            if (index !== -1) {
                order[index] = groupName;
                saveGroupOrder(order);
            }
            
            // 保存されたフィルター状態のグループ名も更新
            const filterState = getFilterState();
            const selectedIndex = filterState.selectedGroups.indexOf(oldName);
            if (selectedIndex !== -1) {
                filterState.selectedGroups[selectedIndex] = groupName;
                saveFilterState(filterState);
            }
        } else {
            // 新規作成の場合は順序の最後に追加
            const order = getGroupOrder();
            order.push(groupName);
            saveGroupOrder(order);
        }
        
        newGroups[groupName] = currentEditingGroup || [];
        saveGroups(newGroups);
        
        // 保存完了フラグを設定
        saveCompleted = true;
        
        // モーダルを閉じる
        document.getElementById('groupNameModal').classList.remove('show');
        closeEditGroupModal();
        
        // Group管理モーダルを更新
        updateGroupList();
    };

    // Group一覧を更新
    function updateGroupList() {
        const groups = getGroups();
        const order = getGroupOrder();
        const container = document.getElementById('groupList');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        // 順序に従ってグループを表示
        order.forEach((groupName, index) => {
            if (groups[groupName]) {
                const groupItem = document.createElement('div');
                groupItem.className = 'group-item';
                groupItem.draggable = true;
                groupItem.dataset.groupName = groupName;
                groupItem.dataset.index = index;
                groupItem.innerHTML = `
                    <div class="group-name">${groupName} (${groups[groupName].length} users)</div>
                    <div class="group-actions">
                        <button class="group-action-btn group-edit-btn" onclick="openEditGroupModal(true, '${groupName}')">Edit</button>
                        <button class="group-action-btn group-delete-btn" onclick="deleteGroup('${groupName}')">Delete</button>
                        <button class="group-action-btn group-drag-btn" title="Drag to reorder">⋮⋮</button>
                    </div>
                `;
                
                // ドラッグイベントを追加
                addDragEvents(groupItem);
                
                container.appendChild(groupItem);
            }
        });
    }

    // ドラッグイベントを追加
    function addDragEvents(groupItem) {
        const dragBtn = groupItem.querySelector('.group-drag-btn');
        
        // ドラッグボタンのマウスダウンで親要素をドラッグ可能にする
        dragBtn.addEventListener('mousedown', function(e) {
            groupItem.draggable = true;
        });
        
        // ドラッグボタン以外の場所ではドラッグを無効にする
        groupItem.addEventListener('mousedown', function(e) {
            if (!e.target.classList.contains('group-drag-btn')) {
                groupItem.draggable = false;
            }
        });
        
        groupItem.addEventListener('dragstart', function(e) {
            if (!e.target.classList.contains('group-drag-btn') && !groupItem.draggable) {
                e.preventDefault();
                return;
            }
            
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
            e.dataTransfer.setData('text/plain', this.dataset.groupName);
        });
        
        groupItem.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
        });
        
        groupItem.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });
        
        groupItem.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        groupItem.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const draggedGroupName = e.dataTransfer.getData('text/plain');
            const targetGroupName = this.dataset.groupName;
            
            if (draggedGroupName !== targetGroupName) {
                reorderGroups(draggedGroupName, targetGroupName);
            }
        });
    }

    // グループの順序を変更
    function reorderGroups(draggedGroupName, targetGroupName) {
        const order = getGroupOrder();
        const draggedIndex = order.indexOf(draggedGroupName);
        const targetIndex = order.indexOf(targetGroupName);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // 配列から削除して新しい位置に挿入
        order.splice(draggedIndex, 1);
        order.splice(targetIndex, 0, draggedGroupName);
        
        // 順序を保存
        saveGroupOrder(order);
        
        // 表示を更新
        updateGroupList();
    }

    // Edit Group内容を更新
    function updateEditGroupContent() {
        const favoriteUsers = getFavoriteUsers();
        const groupMembers = currentEditingGroup || [];
        
        // 検索ボックスのイベントリスナーを設定
        setupUserSearch();
        
        // お気に入りユーザーリストを更新
        updateFavoriteUsersList(favoriteUsers, groupMembers);
        
        // グループメンバーリストを更新
        updateGroupMembersList(groupMembers);
    }

    // 検索機能のセットアップ
    function setupUserSearch() {
        const searchInput = document.getElementById('userSearchInput');
        if (!searchInput) return;
        
        // 既存のイベントリスナーを削除（重複を防ぐため）
        searchInput.removeEventListener('input', handleUserSearch);
        
        // 新しいイベントリスナーを追加
        searchInput.addEventListener('input', handleUserSearch);
        
        // 初期状態では検索文字列をクリア
        searchInput.value = '';
    }

    // 検索処理
    function handleUserSearch() {
        const searchInput = document.getElementById('userSearchInput');
        const searchTerm = searchInput.value.toLowerCase().trim();
        const favoriteUsers = getFavoriteUsers();
        const groupMembers = currentEditingGroup || [];
        
        // 検索結果をフィルタリング
        const filteredUsers = favoriteUsers.filter(user => 
            user.toLowerCase().startsWith(searchTerm)
        );
        
        // フィルタされたリストを表示
        updateFavoriteUsersList(filteredUsers, groupMembers);
    }

    // お気に入りユーザーリストを更新
    function updateFavoriteUsersList(userList, groupMembers) {
        const favContainer = document.getElementById('favoriteUsersList');
        if (!favContainer) return;
        
        favContainer.innerHTML = '';
        userList.forEach(user => {
            const isIncluded = groupMembers.includes(user);
            const userItem = document.createElement('div');
            userItem.className = `user-item ${isIncluded ? 'included' : ''}`;
            userItem.innerHTML = `
                <div class="user-name">${user}</div>
                <button class="user-action-btn user-add-btn" onclick="addUserToGroup('${user}')" ${isIncluded ? 'disabled' : ''}>Add</button>
            `;
            favContainer.appendChild(userItem);
        });
    }

    // グループメンバーリストを更新
    function updateGroupMembersList(groupMembers) {
        const membersContainer = document.getElementById('groupMembersList');
        if (!membersContainer) return;
        
        membersContainer.innerHTML = '';
        groupMembers.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-name">${user}</div>
                <button class="user-action-btn user-delete-btn" onclick="removeUserFromGroup('${user}')">Delete</button>
            `;
            membersContainer.appendChild(userItem);
        });
    }

    // ユーザーをグループに追加
    window.addUserToGroup = function(username) {
        if (!currentEditingGroup.includes(username)) {
            currentEditingGroup.push(username);
            
            // 現在の検索状態を保持して更新
            const searchInput = document.getElementById('userSearchInput');
            if (searchInput && searchInput.value.trim()) {
                handleUserSearch(); // 検索結果を更新
            } else {
                updateEditGroupContent(); // 全体を更新
            }
            
            // グループメンバーリストのみ更新
            updateGroupMembersList(currentEditingGroup);
        }
    };

    // ユーザーをグループから削除
    window.removeUserFromGroup = function(username) {
        const index = currentEditingGroup.indexOf(username);
        if (index !== -1) {
            currentEditingGroup.splice(index, 1);
            
            // 現在の検索状態を保持して更新
            const searchInput = document.getElementById('userSearchInput');
            if (searchInput && searchInput.value.trim()) {
                handleUserSearch(); // 検索結果を更新
            } else {
                updateEditGroupContent(); // 全体を更新
            }
            
            // グループメンバーリストのみ更新
            updateGroupMembersList(currentEditingGroup);
        }
    };

    // グループを削除
    window.deleteGroup = function(groupName) {
        if (confirm(`Are you sure you want to delete group "${groupName}"?`)) {
            const groups = getGroups();
            delete groups[groupName];
            saveGroups(groups);
            
            // 順序からも削除
            const order = getGroupOrder();
            const index = order.indexOf(groupName);
            if (index !== -1) {
                order.splice(index, 1);
                saveGroupOrder(order);
            }
            
            // 保存されたフィルター状態からも削除されたグループを除去
            const filterState = getFilterState();
            if (filterState.selectedGroups.includes(groupName)) {
                filterState.selectedGroups = filterState.selectedGroups.filter(name => name !== groupName);
                
                // 削除後にselectedGroupsが空になった場合はNoneに戻す
                if (filterState.selectedGroups.length === 0) {
                    filterState.noneChecked = true;
                }
                
                saveFilterState(filterState);
            }
            
            updateGroupList();
        }
    };

    // モーダルの内容を更新
    function updateModalContent() {
        const groups = getGroups();
        const order = getGroupOrder();
        const filterState = getFilterState();
        const optionsContainer = document.getElementById('groupFilterOptions');
        
        // Noneオプション以外をクリア
        const noneOption = optionsContainer.querySelector('.group-filter-option');
        optionsContainer.innerHTML = '';
        optionsContainer.appendChild(noneOption);
        
        // グループ順序に従ってオプションを追加
        order.forEach(groupName => {
            if (groups[groupName]) {
                const option = document.createElement('div');
                option.className = 'group-filter-option';
                option.innerHTML = `
                    <input type="checkbox" id="group_${groupName}" data-group="${groupName}">
                    <label for="group_${groupName}">${groupName}</label>
                `;
                optionsContainer.appendChild(option);
            }
        });
        
        // 保存されたフィルター状態を復元
        const noneCheckbox = document.getElementById('noneFilter');
        noneCheckbox.checked = filterState.noneChecked;
        
        // Hide Unregistered Userチェックボックスの状態を復元
        const hideUnregisteredCheckbox = document.getElementById('hideUnregistered');
        if (hideUnregisteredCheckbox) {
            hideUnregisteredCheckbox.checked = filterState.hideUnregistered || false;
        }
        
        // 選択されたグループを復元
        filterState.selectedGroups.forEach(groupName => {
            const checkbox = document.getElementById(`group_${groupName}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // 演算子を復元
        const operationRadio = document.querySelector(`input[name="operation"][value="${filterState.operation}"]`);
        if (operationRadio) {
            operationRadio.checked = true;
        }
        
        // Noneチェックボックスのイベントリスナー
        noneCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // 他のすべてのチェックボックスを外す
                const groupCheckboxes = optionsContainer.querySelectorAll('input[data-group]');
                groupCheckboxes.forEach(cb => cb.checked = false);
            }
        });
        
        // グループチェックボックスのイベントリスナー
        const groupCheckboxes = optionsContainer.querySelectorAll('input[data-group]');
        groupCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Noneチェックボックスを外す
                    noneCheckbox.checked = false;
                }
            });
        });
    }

    // フィルタリングを適用
    function applyFiltering() {
        const modal = document.getElementById('groupFilterModal');
        if (!modal) return;
        
        // 最初にフィルタリングを適用する際に元の統計情報を保存
        saveOriginalStatistics();
        
        // まず未登録ユーザーの表示状態をリセット
        showUnregisteredUsers();
        
        const filterState = getFilterState();
        const noneChecked = filterState.noneChecked;
        
        if (noneChecked) {
            // フィルタリングなし - お気に入り順位表を表示（統計は再計算）
            showFavoriteStandings();
            
            // 未登録ユーザー非表示の処理
            if (filterState.hideUnregistered) {
                hideUnregisteredUsers();
            }
            
            return;
        }
        
        // 選択されたグループを取得
        const selectedGroups = [];
        const groupCheckboxes = modal.querySelectorAll('input[data-group]:checked');
        groupCheckboxes.forEach(cb => {
            selectedGroups.push(cb.dataset.group);
        });
        
        if (selectedGroups.length === 0) {
            // グループが選択されていない場合 - お気に入り順位表を表示（統計は再計算）
            showFavoriteStandings();
            
            // 未登録ユーザー非表示の処理
            if (filterState.hideUnregistered) {
                hideUnregisteredUsers();
            }
            
            return;
        }
        
        // 演算子を取得
        const operation = modal.querySelector('input[name="operation"]:checked').value;
        
        // フィルタリング対象のユーザーセットを計算
        const targetUsers = calculateTargetUsers(selectedGroups, operation);
        
        // 順位表にフィルタリングを適用
        filterStandingsTable(targetUsers);
    }

    // 対象ユーザーセットを計算
    function calculateTargetUsers(selectedGroups, operation) {
        const groups = getGroups();
        let targetUsers = new Set();
        
        if (operation === 'OR') {
            selectedGroups.forEach(groupName => {
                if (groups[groupName]) {
                    groups[groupName].forEach(user => targetUsers.add(user));
                }
            });
        } else { // AND
            if (selectedGroups.length > 0) {
                targetUsers = new Set(groups[selectedGroups[0]] || []);
                for (let i = 1; i < selectedGroups.length; i++) {
                    const groupUsers = new Set(groups[selectedGroups[i]] || []);
                    targetUsers = new Set([...targetUsers].filter(user => groupUsers.has(user)));
                }
            }
        }
        
        return targetUsers;
    }

    // 順位表テーブルにフィルタリングを適用
    function filterStandingsTable(targetUsers) {
        const userRows = getUserRows();
        const visibleRows = [];
        
        userRows.forEach(row => {
            const userCell = row.querySelector('td a[href*="/users/"]');
            if (userCell) {
                const username = userCell.textContent.trim();
                if (targetUsers.has(username)) {
                    row.style.display = '';
                    visibleRows.push(row);
                } else {
                    row.style.display = 'none';
                }
            }
        });
        
        // フィルタされた結果に基づいて順位表を更新
        updateFilteredStandings(visibleRows);
        
        // 未登録ユーザー非表示の処理
        const filterState = getFilterState();
        if (filterState.hideUnregistered) {
            hideUnregisteredUsers();
        }
    }

    // フィルタされた順位表の情報を更新
    function updateFilteredStandings(visibleRows) {
        if (visibleRows.length === 0) return;
        
        // 1. 順位を更新
        updateRankings(visibleRows);
        
        // 2. 問題統計を更新
        updateProblemStatistics(visibleRows);
    }

    // 順位を更新
    function updateRankings(visibleRows) {
        // 元の順位を取得
        const rankedRows = visibleRows.map(row => {
            const rankElement = row.querySelector('.standings-rank');
            if (!rankElement) return null;
            
            // gray属性のspan要素から元の順位を取得（全体順位）
            const graySpan = rankElement.querySelector('span.gray');
            let originalRank = 0;
            
            if (graySpan) {
                // (数字)形式から数字を抽出
                const match = graySpan.textContent.match(/\((\d+)\)/);
                if (match) {
                    originalRank = parseInt(match[1]);
                }
            } else {
                // gray要素がない場合は通常のspan要素から取得
                const span = rankElement.querySelector('span');
                if (span && !span.classList.contains('gray')) {
                    originalRank = parseInt(span.textContent) || 0;
                }
            }
            
            return { row, originalRank };
        }).filter(item => item !== null && item.originalRank > 0); // 全体順位が0の人は除外
        
        // フィルターされたユーザーの元の順位の一覧を取得してソート
        const originalRanks = rankedRows.map(item => item.originalRank).sort((a, b) => a - b);
        
        // ユニークな元の順位を取得してソート
        const uniqueOriginalRanks = [...new Set(originalRanks)].sort((a, b) => a - b);
        
        // 元の順位から新しい相対順位へのマッピングを作成
        const rankMapping = {};
        let newRankCounter = 1;
        
        uniqueOriginalRanks.forEach(originalRank => {
            rankMapping[originalRank] = newRankCounter;
            // 同じ順位のユーザー数を数えて次の順位を決定
            const sameRankCount = originalRanks.filter(rank => rank === originalRank).length;
            newRankCounter += sameRankCount;
        });
        
        // 各行に新しい相対順位を割り当て
        rankedRows.forEach(({ row, originalRank }) => {
            const rankElement = row.querySelector('.standings-rank span:not(.gray)');
            
            if (rankElement) {
                const newRank = rankMapping[originalRank];
                rankElement.textContent = newRank.toString();
            }
        });
    }

    // 問題統計を更新
    function updateProblemStatistics(visibleRows) {
        // 問題数を取得
        const problemCount = getProblemCount();
        if (problemCount === 0) return;
        
        // 各問題の統計を計算
        const problemStats = calculateProblemStatistics(visibleRows, problemCount);
        
        // 最速正解者を更新
        updateFastestSolvers(problemStats);
        
        // 正解者数/提出者数を更新
        updateSolverCounts(problemStats);
    }

    // 問題数を取得
    function getProblemCount() {
        const faRow = document.querySelector('tr.standings-fa');
        if (!faRow) return 0;
        
        const tdElements = faRow.querySelectorAll('td');
        return Math.max(0, tdElements.length - 1); // 1つ目のtdは問題列に対応しないため-1
    }

    // 問題統計を計算
    function calculateProblemStatistics(visibleRows, problemCount) {
        const stats = [];
        
        // 各問題の統計を初期化
        for (let i = 0; i < problemCount; i++) {
            stats.push({
                fastestSolver: null,
                fastestTime: Infinity,
                solverCount: 0,
                submitterCount: 0
            });
        }
        
        // 各ユーザーの結果を解析
        visibleRows.forEach((row, userIndex) => {
            const username = getUsernameFromRow(row);
            const userColor = getUserColorFromRow(row);
            const results = row.querySelectorAll('td.standings-result');
            
            // 最初のstandings-resultは総合得点なのでスキップ
            for (let i = 1; i <= problemCount && i < results.length; i++) {
                const result = results[i];
                const problemIndex = i - 1;
                
                const acSpan = result.querySelector('span.standings-ac');
                const resultText = result.textContent.trim();
                
                if (acSpan) {
                    // 正解の場合 - 時刻部分を抽出
                    const timeMatch = resultText.match(/(\d+:\d+)/);
                    if (timeMatch) {
                        const timeText = timeMatch[1];
                        
                        stats[problemIndex].solverCount++;
                        stats[problemIndex].submitterCount++;
                        
                        // 時間を秒に変換
                        const timeInSeconds = parseTimeToSeconds(timeText);
                        
                        // 最速かチェック
                        if (timeInSeconds < stats[problemIndex].fastestTime) {
                            stats[problemIndex].fastestTime = timeInSeconds;
                            stats[problemIndex].fastestSolver = {
                                username: username,
                                time: timeText,
                                color: userColor
                            };
                        }
                    }
                } else if (resultText.match(/^\(\d+\)$/)) {
                    // 不正解の場合（提出はしている）
                    stats[problemIndex].submitterCount++;
                }
            }
        });
        
        return stats;
    }

    // 行からユーザー名を取得
    function getUsernameFromRow(row) {
        const userLink = row.querySelector('td a[href*="/users/"]');
        return userLink ? userLink.textContent.trim() : '';
    }

    // 行からユーザーの色を取得
    function getUserColorFromRow(row) {
        const userLink = row.querySelector('td a[href*="/users/"]');
        if (!userLink) return '';
        
        // ユーザーリンク内のspan要素から色情報を取得
        const userSpan = userLink.querySelector('span');
        if (userSpan) {
            // spanのclass属性をそのまま取得
            const className = userSpan.getAttribute('class');
            if (className) {
                return className;
            }
            
            // class属性がない場合はstyle属性を確認
            const style = userSpan.getAttribute('style');
            if (style && style.includes('color')) {
                return `style="${style}"`;
            }
        }
        
        // フォールバック: リンク自体のclass属性から色情報を取得
        const classList = userLink.classList;
        for (let className of classList) {
            if (className.startsWith('user-') || className.includes('color')) {
                return className;
            }
        }
        
        return '';
    }

    // 元の統計情報を保存（全体順位表の統計情報）
    function saveOriginalStatistics() {
        if (originalFastestSolvers && originalSolverCounts) {
            return; // 既に保存済み
        }
        
        // 最速正解者の情報を保存（全体順位表から）
        const faRow = document.querySelector('tr.standings-fa');
        if (faRow) {
            const tdElements = faRow.querySelectorAll('td');
            originalFastestSolvers = [];
            for (let i = 1; i < tdElements.length; i++) {
                originalFastestSolvers.push(tdElements[i].innerHTML);
            }
        }
        
        // 正解者数/提出者数の情報を保存（全体順位表から）
        const statsRow = document.querySelector('tr.standings-statistics');
        if (statsRow) {
            const tdElements = statsRow.querySelectorAll('td');
            originalSolverCounts = [];
            for (let i = 1; i < tdElements.length; i++) {
                originalSolverCounts.push(tdElements[i].innerHTML);
            }
        }
    }

    // 元の統計情報を復元
    function restoreOriginalStatistics() {
        if (!originalFastestSolvers || !originalSolverCounts) {
            return;
        }
        
        // 最速正解者を復元
        const faRow = document.querySelector('tr.standings-fa');
        if (faRow && originalFastestSolvers) {
            const tdElements = faRow.querySelectorAll('td');
            for (let i = 1; i < tdElements.length && i - 1 < originalFastestSolvers.length; i++) {
                tdElements[i].innerHTML = originalFastestSolvers[i - 1];
            }
        }
        
        // 正解者数/提出者数を復元
        const statsRow = document.querySelector('tr.standings-statistics');
        if (statsRow && originalSolverCounts) {
            const tdElements = statsRow.querySelectorAll('td');
            for (let i = 1; i < tdElements.length && i - 1 < originalSolverCounts.length; i++) {
                tdElements[i].innerHTML = originalSolverCounts[i - 1];
            }
        }
        
        // フォントサイズを再調整
        setTimeout(() => {
            recalculateStatisticsFontSizes();
        }, 100);
    }
    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        if (parts.length !== 2) return Infinity;
        
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parseInt(parts[1]) || 0;
        return minutes * 60 + seconds;
    }

    // 最速正解者を更新
    function updateFastestSolvers(problemStats) {
        const faRow = document.querySelector('tr.standings-fa');
        if (!faRow) return;
        
        const tdElements = faRow.querySelectorAll('td');
        
        problemStats.forEach((stat, index) => {
            const tdIndex = index + 1; // 最初のtdはスキップ
            if (tdIndex < tdElements.length) {
                const td = tdElements[tdIndex];
                
                if (stat.fastestSolver) {
                    const { username, time, color } = stat.fastestSolver;
                    
                    // 元のスタイルを取得
                    const existingP = td.querySelector('p.fit-font-size');
                    const existingStyle = existingP ? existingP.getAttribute('style') : 'font-size: 10px; width: 50px;';
                    const noBreakClass = existingP && existingP.classList.contains('no-break') ? ' no-break' : '';
                    
                    // HTML構造を元の形式で作成
                    let html = `<p class="fit-font-size${noBreakClass}" style="${existingStyle}">`;
                    html += `<a href="https://atcoder.jp/users/${username}" class="username">`;
                    
                    // 色の処理を改善
                    if (color.startsWith('style=')) {
                        // style属性の場合
                        html += `<span ${color}>${username}</span>`;
                    } else {
                        // class属性の場合
                        html += `<span class="${color}">${username}</span>`;
                    }
                    
                    html += `</a></p>`;
                    html += `<p>${time}</p>`;
                    
                    td.innerHTML = html;
                } else {
                    // 最速正解者がいない場合は"-"を表示
                    const existingP = td.querySelector('p.fit-font-size');
                    const existingStyle = existingP ? existingP.getAttribute('style') : 'font-size: 10px; width: 50px;';
                    const noBreakClass = existingP && existingP.classList.contains('no-break') ? ' no-break' : '';
                    
                    td.innerHTML = `<p class="fit-font-size${noBreakClass}" style="${existingStyle}">-</p>`;
                }
            }
        });
        
        // フォントサイズを再調整
        setTimeout(() => {
            recalculateStatisticsFontSizes();
        }, 100);
    }

    // 正解者数/提出者数を更新
    function updateSolverCounts(problemStats) {
        const statsRow = document.querySelector('tr.standings-statistics');
        if (!statsRow) return;
        
        const tdElements = statsRow.querySelectorAll('td');
        
        problemStats.forEach((stat, index) => {
            const tdIndex = index + 1; // 最初のtdはスキップ
            if (tdIndex < tdElements.length) {
                const td = tdElements[tdIndex];
                
                // tdにclass属性がある場合は"-"のみ表示
                const tdClass = td.getAttribute('class');
                if (tdClass && tdClass.trim() !== '') {
                    // 元のスタイルを取得
                    const existingP = td.querySelector('p.fit-font-size');
                    const existingStyle = existingP ? existingP.getAttribute('style') : 'font-size: 10px; width: 50px;';
                    
                    td.innerHTML = `<p class="fit-font-size" style="${existingStyle}">-</p>`;
                } else {
                    // 通常の統計表示
                    // 元のスタイルを取得
                    const existingP = td.querySelector('p.fit-font-size');
                    const existingStyle = existingP ? existingP.getAttribute('style') : 'font-size: 10px; width: 50px;';
                    
                    // HTML構造を元の形式で作成
                    const html = `<p class="fit-font-size" style="${existingStyle}">` +
                        `<span class="standings-ac">${stat.solverCount}</span> / <span>${stat.submitterCount}</span>` +
                        `</p>`;
                    
                    td.innerHTML = html;
                }
            }
        });
        
        // フォントサイズを再調整
        setTimeout(() => {
            recalculateStatisticsFontSizes();
        }, 100);
    }

    // すべての行を表示（統計情報復元は別途呼び出し）
    function showAllRows() {
        const standingsTable = document.querySelector('#standings-tbody, .table tbody');
        if (!standingsTable) return;
        
        const rows = standingsTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const userCell = row.querySelector('td a[href*="/users/"]');
            if (userCell) {
                row.style.display = '';
            }
        });
    }

    // フォントサイズを調整する関数
    function adjustFontSize(element) {
        if (!element) return 10;
        
        // jQuery fitFontSizeプラグインが利用可能かチェック (基本的には使えるはず)
        if (typeof $ !== 'undefined' && $.fn && $.fn.fitFontSize) {
            return adjustFontSizeWithPlugin(element);
        } else {
            return adjustFontSizeDynamic(element);
        }
    }
    
    // jQuery fitFontSizeプラグインを使用した調整
    function adjustFontSizeWithPlugin(element) {
        const $element = $(element);
        const textContent = element.textContent.trim();
        const textLength = textContent.length;
        
        const problemCount = getProblemCount();
        const availableWidth = (Math.max(60, 420/(problemCount + 1)))-10;
        
        $element.fitFontSize(availableWidth, textLength / 1.5, 10);
        
        const resultFontSize = parseInt($element.css('font-size'));
        return resultFontSize;
    }
    
    // 動的フォントサイズ調整（プラグイン未使用）
    function adjustFontSizeDynamic(element) {
        const parentWidth = element.parentElement.offsetWidth;
        const textContent = element.textContent.trim();
        const textLength = textContent.length;
        
        // 利用可能な幅を計算（余白を考慮）
        const availableWidth = Math.max(60, parentWidth - 20);
        
        let fontSize;
        let minFontSize;
        
        // テキストの長さに応じた基本フォントサイズと最小サイズを計算
        if (textLength === 0) {
            fontSize = 10;
            minFontSize = 10;
        } else if (textLength <= 3) {
            // 非常に短いテキスト: 大きめのフォント
            fontSize = Math.min(14, Math.floor(availableWidth / (textLength * 10)));
            minFontSize = 10;
        } else if (textLength <= 8) {
            // 短いテキスト: 中程度のフォント
            fontSize = Math.min(12, Math.floor(availableWidth / (textLength * 8)));
            minFontSize = 9;
        } else if (textLength <= 15) {
            // 中程度のテキスト: やや小さめのフォント
            fontSize = Math.min(11, Math.floor(availableWidth / (textLength * 6)));
            minFontSize = 8;
        } else {
            // 長いテキスト: 小さめのフォント
            fontSize = Math.min(10, Math.floor(availableWidth / (textLength * 5)));
            minFontSize = 7;
        }
        
        // 最小フォントサイズを保証
        fontSize = Math.max(minFontSize, fontSize);
        
        // フォントサイズと改行設定を適用
        element.style.fontSize = fontSize + 'px';
        element.style.whiteSpace = 'normal';
        element.style.wordBreak = 'break-word';
        
        // デバッグ用ログ（必要に応じてコメントアウト）
        // console.log(`dynamicSize: text="${textContent}" length=${textLength} width=${availableWidth} minSize=${minFontSize} result=${fontSize}px`);
        
        return fontSize;
    }

    // 統計情報のフォントサイズを再調整
    function recalculateStatisticsFontSizes() {
        // DOM更新後の計算のため少し待つ
        setTimeout(() => {
            // 最速正解者のフォントサイズを調整
            const faRow = document.querySelector('tr.standings-fa');
            if (faRow) {
                const tdElements = faRow.querySelectorAll('td');
                
                for (let i = 1; i < tdElements.length; i++) {
                    const td = tdElements[i];
                    if (td.offsetWidth > 0) { // 表示されている要素のみ処理
                        const pElements = td.querySelectorAll('p.fit-font-size');
                        
                        pElements.forEach((p) => {
                            adjustFontSize(p);
                        });
                    }
                }
            }
            
            // 正解者数/提出者数のフォントサイズを調整
            const statsRow = document.querySelector('tr.standings-statistics');
            if (statsRow) {
                const tdElements = statsRow.querySelectorAll('td');
                
                for (let i = 1; i < tdElements.length; i++) {
                    const td = tdElements[i];
                    if (td.offsetWidth > 0) { // 表示されている要素のみ処理
                        const pElements = td.querySelectorAll('p.fit-font-size');
                        
                        pElements.forEach((p) => {
                            adjustFontSize(p);
                        });
                    }
                }
            }
        }, 50);
    }

    // "Filtering by Group"ボタンを追加
    function addFilteringButton() {
        const delay = 1000; // 1秒待機
        
        setTimeout(() => {
            // お気に入りのみ表示のチェックボックスを探す（IDで検索）
            const favCheckbox = document.getElementById("checkbox-fav-only");
            if (!favCheckbox) {
                console.log('お気に入りチェックボックスが見つかりません');
                return;
            }
            
            const favContainer = favCheckbox.closest('label') || favCheckbox.parentElement;
            if (!favContainer) {
                console.log('お気に入りコンテナが見つかりません');
                return;
            }
            
            // 既にボタンが追加されている場合はスキップ
            if (document.querySelector('.filtering-by-group-btn')) {
                return;
            }
            
            // 初期状態を保存（チェックボックスがONの場合に備えて）
            const initialCheckedState = favCheckbox.checked;
            
            // チェックボックスがONの場合、一瞬OFFにして全体統計を保存
            if (initialCheckedState) {
                console.log('初期状態がONのため、一瞬OFFにして全体統計を保存します');
                favCheckbox.checked = false;
                // チェックボックスの変更イベントを発火させて全体表示にする
                favCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                
                // 少し待ってから統計を保存
                setTimeout(() => {
                    saveOriginalStatistics();
                    
                    // 元の状態に戻す
                    favCheckbox.checked = true;
                    favCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // さらに少し待ってからフィルター状態を適用
                    setTimeout(() => {
                        applyStoredFiltering();
                    }, 200);
                }, 300);
            } else {
                // 初期状態がOFFの場合は、そのまま統計を保存
                saveOriginalStatistics();
            }
            
            // ボタンを作成
            const filteringBtn = document.createElement('button');
            filteringBtn.textContent = 'Filtering by Group';
            filteringBtn.className = 'filtering-by-group-btn';
            filteringBtn.type = 'button'; // フォーム送信を防ぐ
            filteringBtn.addEventListener('click', function(e) {
                e.preventDefault(); // デフォルト動作を防ぐ
                e.stopPropagation(); // イベントの伝播を防ぐ
                openGroupFilterModal();
            });
            
            // Clear Filteringボタンを作成
            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear Filtering';
            clearBtn.className = 'clear-filtering-btn';
            clearBtn.type = 'button';
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                clearFiltering();
                updateClearButtonState(); // 状態を更新
            });
            
            // ボタンの有効/無効を判定する関数
            function updateClearButtonState() {
                const filterState = getFilterState();
                const isFavChecked = favCheckbox.checked;
                const isNoneSelected = filterState.noneChecked || filterState.selectedGroups.length === 0;
                
                // お気に入りOFF または フィルタリングがNone/未選択の場合は無効
                clearBtn.disabled = !isFavChecked || isNoneSelected;
            }
            
            // お気に入りのみ表示の状態に応じてボタンの有効/無効を切り替え
            function updateButtonState() {
                filteringBtn.disabled = !favCheckbox.checked;
                updateClearButtonState(); // Clear ボタンの状態も更新
            }
            
            // 初期状態を設定
            updateButtonState();
            
            // チェックボックスの変更を監視
            favCheckbox.addEventListener('change', function() {
                updateButtonState();
                
                // チェックボックスがオフになった場合は元の統計情報を復元
                if (!this.checked) {
                    // 未登録ユーザーの非表示も解除
                    showUnregisteredUsers();
                    restoreOriginalStatistics();
                } else {
                    // チェックボックスがオンになった場合は保存されたフィルター状態を適用
                    setTimeout(() => {
                        applyStoredFiltering();
                        // お気に入りのみ表示がオンになったときに自動でHide未登録ユーザーを実行
                        const filterState = getFilterState();
                        if (filterState.hideUnregistered) {
                            hideUnregisteredUsers();
                        }
                    }, 100); // 少し遅延させてDOM更新を待つ
                }
            });
            
            // ボタンを挿入
            favContainer.parentNode.insertBefore(filteringBtn, favContainer.nextSibling);
            favContainer.parentNode.insertBefore(clearBtn, filteringBtn.nextSibling);
            
            // 初期状態がOFFの場合のみ、すぐにフィルター状態を適用
            if (!initialCheckedState) {
                setTimeout(() => {
                    applyStoredFiltering();
                }, 500);
            } else {
                // 初期状態がONの場合は、Hide未登録ユーザーも実行
                setTimeout(() => {
                    const filterState = getFilterState();
                    if (filterState.hideUnregistered) {
                        hideUnregisteredUsers();
                    }
                }, 500);
            }
        }, delay);
    }

    // 保存されたフィルター状態を適用
    function applyStoredFiltering() {
        const filterState = getFilterState();
        
        // お気に入りのみ表示がオンの場合のみフィルタリングを適用
        const favCheckbox = document.getElementById("checkbox-fav-only");
        if (!favCheckbox || !favCheckbox.checked) {
            return;
        }
        
        // 最初にフィルタリングを適用する際に元の統計情報を保存
        saveOriginalStatistics();
        
        if (filterState.noneChecked || filterState.selectedGroups.length === 0) {
            // フィルタリングなし - お気に入り順位表を表示（統計は再計算）
            const standingsTable = document.querySelector('#standings-tbody, .table tbody');
            if (standingsTable) {
                const rows = standingsTable.querySelectorAll('tr');
                const visibleRows = [];
                
                rows.forEach(row => {
                    const userCell = row.querySelector('td a[href*="/users/"]');
                    if (userCell) {
                        row.style.display = '';
                        visibleRows.push(row);
                    }
                });
                
                // お気に入り順位表の統計を再計算
                console.log('お気に入り順位表の統計を再計算します');
                updateFilteredStandings(visibleRows);
            }
            return;
        }
        
        // フィルタリング対象のユーザーセットを計算
        const targetUsers = calculateTargetUsers(filterState.selectedGroups, filterState.operation);
        
        // 順位表にフィルタリングを適用
        filterStandingsTable(targetUsers);
    }

    // お気に入り設定ページに"Manage Group"ボタンを追加
    function addManageGroupButton() {
        
        setTimeout(() => {
            // 同期ボタンを探す（正確なセレクタ）
            let syncButton = document.querySelector('a.btn.btn-default');
            
            // 「同期」という文字を含むことを確認
            if (syncButton && !syncButton.textContent.includes('同期')) {
                syncButton = null;
            }
            
            // フォールバック: glyphicon-transferを含む要素を探す
            if (!syncButton) {
                const transferIcon = document.querySelector('.glyphicon-transfer');
                if (transferIcon) {
                    syncButton = transferIcon.closest('a.btn');
                }
            }
            
            if (!syncButton) {
                console.log('同期ボタンが見つかりません');
                console.log('利用可能な .btn 要素:', document.querySelectorAll('.btn').length);
                console.log('利用可能な a.btn-default 要素:', document.querySelectorAll('a.btn-default').length);
                return;
            }
            
            console.log('見つかった同期ボタン:', syncButton.textContent.trim());
            
            // 既にボタンが追加されている場合はスキップ
            if (document.querySelector('.manage-group-btn')) {
                return;
            }
            
            // ボタンを作成
            const manageBtn = document.createElement('button');
            manageBtn.textContent = 'Manage Group';
            manageBtn.className = 'manage-group-btn';
            manageBtn.type = 'button';
            manageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openGroupManageModal();
            });
            
            // 同期ボタンの親要素（<p>タグ）に追加
            const parentP = syncButton.parentElement;
            if (parentP && parentP.tagName === 'P') {
                parentP.appendChild(document.createTextNode(' '));
                parentP.appendChild(manageBtn);
            } else {
                // フォールバック: 同期ボタンの隣に挿入
                syncButton.parentNode.insertBefore(manageBtn, syncButton.nextSibling);
            }
            
            console.log('Manage Groupボタンを追加しました');
        });
    }

    // 初期化
    function initialize() {
        // グループデータの初期化
        initializeGroups();
        
        // スタイルを追加
        addModalStyles();
        
        // 現在のページに応じて初期化
        const currentUrl = window.location.href;
        
        if (currentUrl.includes('/contests/') && currentUrl.includes('/standings')) {
            // 順位表ページ
            createModal();
            addFilteringButton();
        } else if (currentUrl.includes('/settings/fav')) {
            // お気に入り設定ページ
            createGroupManageModal();
            createEditGroupModal();
            createGroupNameModal();
            addManageGroupButton();
        }
    }

    // スクリプト開始
    initialize();

})();
