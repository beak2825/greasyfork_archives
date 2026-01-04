// alchemyDetail.js
$(document).ready(function() {
    // 确保itemData存在（从全局获取）
    const itemData = window.itemData || {};
    
    // 存储炼金数据
    let alchemyData = {};
    
    // 加载炼金数据
    function loadAlchemyData() {
        return $.getJSON("https://raw.githubusercontent.com/810517583/Milkyalchemy/refs/heads/main/alchemy-data.json")
            .done(function(data) {
                alchemyData = data;
                console.log("炼金数据加载完成over");
            })
            .fail(function() {
                console.error("炼金数据加载失败tobad");
            });
    }
    
    // 查找物品的炼金数据
 function findAlchemyData(chineseName) {
    // 在全局itemData中查找物品ID
    const itemEntry = Object.entries(itemData).find(
        ([id, name]) => name === chineseName
    );
    
    if (!itemEntry) {
        console.warn(`未找到物品: ${chineseName}`);
        return null;
    }
    
    const itemId = itemEntry[0].toLowerCase();
    const itemInfo = alchemyData[itemId];
    
    // 检查并提取炼金数据
    if (!itemInfo || !itemInfo.alchemyDetail) {
        console.warn(`找到物品但无炼金数据: ${chineseName} (ID: ${itemId})`);
        return null;
    }
    
    // 返回标准化结构
    return {
        successRate: itemInfo.alchemyDetail.transmuteSuccessRate,
        dropTable: itemInfo.alchemyDetail.transmuteDropTable || []
    };
}
    
    // 自动填充函数
async function autoFillAlchemyData(chineseName) {
    try {
        const detail = findAlchemyData(chineseName);
        
        // 防御性检查
        if (!detail) {
            console.warn(`无法获取炼金数据: ${chineseName}`);
            return;
        }
        
        // 1. 填充基础成功率（转换为百分比）
        $('#nonesuccessRate').val((detail.successRate * 100).toFixed(1)).trigger('change');
        
        // 2. 清空现有产出物品行（保留第一行）
        $('#outputItems tr:not(:first)').remove();
        
        // 3. 填充产出物品数据
        if (!Array.isArray(detail.dropTable)) {
            console.warn(`产出表格式不正确:`, detail.dropTable);
            return;
        }
        
        detail.dropTable.forEach((drop, index) => {
            const $row = (index === 0) 
                ? $('#outputItems tr:first') 
                : $('#outputItems tr:first').clone().appendTo('#outputItems');
            
            // 获取中文名称（使用全局itemData映射）
            const itemName = itemData[drop.itemHrid] || 
                            drop.itemHrid.split('/').pop().replace(/_/g, ' ');
            
            // 填充数据
            $row.find('.output-item').val(itemName);
            $row.find('.output-probability').val((drop.dropRate * 100).toFixed(3)); // 保留3位小数
            
            // 重置价格（不自动获取）
            $row.find('.output-price').val('0');
        });
        
    } catch (error) {
        console.error("自动填充失败:", error);
    }
}
    
    // 初始化
    loadAlchemyData();
    
    // 监听物品输入框变化
    $('.alchemy-text').on('change', function() {
        const name = $(this).val().trim();
        if (name) autoFillAlchemyData(name);
    });
});