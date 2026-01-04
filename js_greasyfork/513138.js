// 語言範本函數庫
(function() {
    'use strict';
    
    window.languageTemplates = function(lang) {
        const styles = {
            zh: {
                inputStyle: `
                    position: absolute !important;
                    font-weight: bold !important;
                    right: 205px !important; /* 中文特定的右邊距 */
                    width: 80px !important;
                    top: 20px !important;
                    background-color: transparent !important;
                    color: red !important;
                    border: none !important;
                    z-index: 2 !important;
                    display: inline-block !important;
                `
            },
            ja: {
                inputStyle: `
                    position: absolute !important;
                    font-weight: bold !important;
                    right: 338px !important; /* 日文特定的右邊距 */
                    width: 80px !important;
                    top: 20px !important;
                    background-color: transparent !important;
                    color: red !important;
                    border: none !important;
                    z-index: 2 !important;
                    display: inline-block !important;
                `
            },
            en: {
                inputStyle: `
                    position: absolute !important;
                    font-weight: bold !important;
                    right: 281px !important; /* 英文特定的右邊距 */
                    width: 80px !important;
                    top: 20px !important;
                    background-color: transparent !important;
                    color: red !important;
                    border: none !important;
                    z-index: 2 !important;
                    display: inline-block !important;
                `
            },
        };

        // 根據語言返回對應的模板、警報和按鈕
        if (lang.startsWith('zh-CN')) {
            return {
                templates: {
                    "模版 1": "这是模版1的内容。",
                    "模版 2": "这是模版2的内容。",
                    "模版 3": "这是模版3的内容。",
                    "模版 4": "这是模版4的内容。",
                    "模版 5": "这是模版5的内容。"
                },
                alerts: {
                    saveSuccess: "模版已保存！",
                    deleteConfirm: "确定要删除选中的模版吗？",
                    deleteSuccess: "模版已删除！",
                    editorNotFound: "未找到具体的编辑器区域元素",
                    iframeNotFound: "未找到 iframe 元素",
                    enterTemplateName: "模版名称",
                    clearCacheConfirmation: "此操作将删除所有模块名称及内容，将继续执行此操作吗？",
                    clearCachePrompt: "請輸入 'delete' 以確認清除緩存：",
                    clearCacheSuccess: "緩存已成功清除！",
                    clearCacheCancel: "清除緩存操作已取消！",
                    templateChangeConfirmation: "选择新模板将清除当前输入框的内容，是否确认？" // 添加的新警报
                },
                buttons: {
                    save: "保存模版",
                    delete: "删除模版"
                },
                menuCommands: {
                    clearCache: "清除緩存"
                },
                styles: styles.zh // 將樣式包含進來
            };
        } else if (lang.startsWith('zh')) {
            return {
                templates: {
                    "範本 1": "這是範本1的內容。",
                    "範本 2": "這是範本2的內容。",
                    "範本 3": "這是範本3的內容。",
                    "範本 4": "這是範本4的內容。",
                    "範本 5": "這是範本5的內容。"
                },
                alerts: {
                    saveSuccess: "範本已保存！",
                    deleteConfirm: "確定要刪除選中的範本嗎？",
                    deleteSuccess: "範本已刪除！",
                    editorNotFound: "未找到具體的編輯器區域元素",
                    iframeNotFound: "未找到 iframe 元素",
                    enterTemplateName: "範本名稱",
                    clearCacheConfirmation: "此操作將刪除所有範本名稱及內容，將繼續執行此操作嗎？",
                    clearCachePrompt: "請輸入 'delete' 以確認清除緩存：",
                    clearCacheSuccess: "緩存已成功清除！",
                    clearCacheCancel: "清除緩存操作已取消！",
                    templateChangeConfirmation: "選擇新範本將清除當前輸入框的內容，是否確認？" // 添加的新警報
                },
                buttons: {
                    save: "保存範本",
                    delete: "刪除範本"
                },
                menuCommands: {
                    clearCache: "清除緩存"
                },
                styles: styles.zh // 將樣式包含進來
            };
        } else if (lang.startsWith('en')) {
            return {
                templates: {
                    "Template 1": "This is the content of Template 1.",
                    "Template 2": "This is the content of Template 2.",
                    "Template 3": "This is the content of Template 3.",
                    "Template 4": "This is the content of Template 4.",
                    "Template 5": "This is the content of Template 5."
                },
                alerts: {
                    saveSuccess: "Template saved!",
                    deleteConfirm: "Are you sure you want to delete the selected template?",
                    deleteSuccess: "Template deleted!",
                    editorNotFound: "Editor area element not found",
                    iframeNotFound: "Iframe element not found",
                    enterTemplateName: "Template",
                    clearCacheConfirmation: "This action will delete all template names and contents. Do you want to continue?",
                    clearCachePrompt: "Please enter 'delete' to confirm clearing the cache:",
                    clearCacheSuccess: "Cache cleared successfully!",
                    clearCacheCancel: "Cache clearing operation cancelled!",
                    templateChangeConfirmation: "Choosing a new template will clear the current input box content. Are you sure?" // 添加的新警报
                },
                buttons: {
                    save: "Save Template",
                    delete: "Delete Template"
                },
                menuCommands: {
                    clearCache: "Clear Cache"
                },
                styles: styles.en // 預設為英文樣式
            };
        } else if (lang.startsWith('ja')) {
            return {
                templates: {
                    "テンプレート 1": "これはテンプレート1の内容です。",
                    "テンプレート 2": "これはテンプレート2の内容です。",
                    "テンプレート 3": "これはテンプレート3の内容です。",
                    "テンプレート 4": "これはテンプレート4の内容です。",
                    "テンプレート 5": "これはテンプレート5の内容です。"
                },
                alerts: {
                    saveSuccess: "テンプレートが保存されました！",
                    deleteConfirm: "選択したテンプレートを削除しますか？",
                    deleteSuccess: "テンプレートが削除されました！",
                    editorNotFound: "エディターエリアが見つかりません",
                    iframeNotFound: "iframeが見つかりません",
                    enterTemplateName: "テンプレート名",
                    clearCacheConfirmation: "この操作はすべてのテンプレート名と内容を削除します。続行しますか？",
                    clearCachePrompt: "キャッシュをクリアするには「delete」と入力してください：",
                    clearCacheSuccess: "キャッシュが正常にクリアされました！",
                    clearCacheCancel: "キャッシュクリア操作がキャンセルされました！",
                    templateChangeConfirmation: "新しいテンプレートを選択すると、現在の入力ボックスの内容がクリアされます。続行しますか？" // 添加的新警报
                },
                buttons: {
                    save: "テンプレートを保存",
                    delete: "テンプレートを削除"
                },
                menuCommands: {
                    clearCache: "キャッシュをクリア"
                },
                styles: styles.ja // 將樣式包含進來
            };
        } else {
            return {
                templates: {
                    "Template 1": "This is the content of Template 1.",
                    "Template 2": "This is the content of Template 2.",
                    "Template 3": "This is the content of Template 3.",
                    "Template 4": "This is the content of Template 4.",
                    "Template 5": "This is the content of Template 5."
                },
                alerts: {
                    saveSuccess: "Template saved!",
                    deleteConfirm: "Are you sure you want to delete the selected template?",
                    deleteSuccess: "Template deleted!",
                    editorNotFound: "Editor area element not found",
                    iframeNotFound: "Iframe element not found",
                    enterTemplateName: "Template",
                    clearCacheConfirmation: "This action will delete all template names and contents. Do you want to continue?",
                    clearCachePrompt: "Please enter 'delete' to confirm clearing the cache:",
                    clearCacheSuccess: "Cache cleared successfully!",
                    clearCacheCancel: "Cache clearing operation cancelled!",
                    templateChangeConfirmation: "Choosing a new template will clear the current input box content. Are you sure?" // 添加的新警报
                },
                buttons: {
                    save: "Save Template",
                    delete: "Delete Template"
                },
                menuCommands: {
                    clearCache: "Clear Cache"
                },
                styles: styles.en // 預設為英文樣式
            };
        }
    };
})();
