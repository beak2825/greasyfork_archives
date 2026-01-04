function updateTotalCost() {
    const itemPrice = parseFloat($('#itemPrice').val()) || 0;
    const catalystCost = parseFloat($('#Catalyst').val()) || 0;
    const goldCost = parseFloat($('#costPerTry').val()) || 0;    
    const totalCost = itemPrice + catalystCost + goldCost;
    $('#allcostPerTry').val(totalCost).trigger('change');
}
const CATALYST_BONUS = {
    "catalyst_of_transmutation": 0.15,
    "prime_catalyst": 0.25,
    "": 0
};
// 计算最终成功率（全局函数）
function updateSuccessRate() {
    const baseRate = parseFloat($('#nonesuccessRate').val()) || 0;
    const catalystType = $('#catalystType').val();
    
    // 核心公式：基础 × 1.05 + 基础 × 催化剂加成
    const bonusMultiplier = CATALYST_BONUS[catalystType] || 0;
    const finalRate = (baseRate * 1.05) + (baseRate * bonusMultiplier);
    
    $('#successRate').val(Math.min(100, finalRate).toFixed(2));
}
$(document).ready(function() {
	let currentMaterialMode = 'ask'; // 成本默认左一(ask)
	let currentOutputMode = 'ask';   // 产出默认左一(ask)
    const itemData = window.itemData || {};
// 催化剂价格映射（物品ID到中文名的映射）
   
    // 转换为自动完成需要的格式 [{label: "显示名称", value: "物品ID"}]
    const autocompleteData = Object.entries(itemData).map(([id, name]) => {
        return { label: name, value: id.replace('/items/', '') };
    });
    
    // 为所有输入框添加自动完成功能
    function setupAutocomplete(inputElement, priceMode) {
        $(inputElement).autocomplete({
            source: function(request, response) {
                const results = $.ui.autocomplete.filter(autocompleteData, request.term);
                response(results.slice(0, 10));
            },
            select: function(event, ui) {
                $(this).val(ui.item.label);                
                if ($(this).hasClass('alchemy-text')) {
                    fetchItemPrice(ui.item.value, $('#itemPrice'), currentMaterialMode);
                } else {
                    fetchItemPrice(
                        ui.item.value,
                        $(this).closest('tr').find('.output-price'),
                        currentOutputMode
                    );
                }
                return false;
        },
        focus: function(event, ui) {
            // 高亮显示匹配部分（可选）
            $(this).val(ui.item.label);
            return false;
        },
        minLength: 1 // 输入1个字符后触发搜索
    }).data("ui-autocomplete")._renderItem = function(ul, item) {
        // 自定义渲染结果项（保留图标和名称）
        return $("<li>")
            .append(`<div> ${item.label}</div>`)
            .appendTo(ul);
    };
}
    
    // 为所有相关输入框设置自动完成
    $('.alchemy-text, .output-item').each(function() {
        setupAutocomplete(this);
    });
    
    // 获取物品价格的函数（适配ask/bid返回格式）
function fetchItemPrice(itemId, priceInput, priceMode) {
	if (!itemId || !priceInput) return;
	
	priceInput.addClass('loading-price').prop('readonly', true);
    const encodedName = encodeURIComponent(itemId);
	
    $.getJSON(`https://mooket.qi-e.top/market/item/price?name=/items/${encodedName}`)	
        .always(() => {
            priceInput.removeClass('loading-price').prop('readonly', false);
        })
        .done((data) => {
            if (data) {
                // 直接使用传入的priceMode参数
                const price = priceMode === 'ask' ? data.ask : data.bid;
                if (price !== undefined) {
                    priceInput.val(price).trigger('change');
					updateTotalCost();
                }
            }
        })
        .fail(function() {
            console.error('价格查询失败:', itemId);
            // 可以添加UI提示，例如：
            $(priceInput).val('?').css('color', '#ff6b6b');
            setTimeout(() => $(priceInput).css('color', ''), 1000);
        });
}
    
    // 监听价格模式切换（适配ask/bid逻辑）
    // 材料价格模式切换
$('select[name="materialPriceMode"]').change(function() {
    currentMaterialMode = $(this).val(); // 更新当前模式
    const itemName = $('.alchemy-text').val();
    if (itemName) {
        const itemId = findItemIdByName(itemName);
        if (itemId) {
            fetchItemPrice(itemId, $('#itemPrice'), currentMaterialMode);
        }
    }
});

// 产出价格模式切换
$('select[name="outputPriceMode"]').change(function() {
    currentOutputMode = $(this).val(); // 更新当前模式
    $('.output-item').each(function() {
        const itemName = $(this).val();
        if (itemName) {
            const itemId = findItemIdByName(itemName);
            if (itemId) {
                fetchItemPrice(
                    itemId,
                    $(this).closest('tr').find('.output-price'),
                    currentOutputMode
                );
            }
        }
    });
});
    
    // 根据中文名称查找物品ID
    function findItemIdByName(name) {
        const entry = autocompleteData.find(item => item.label === name);
        return entry ? entry.value : null;
    }
    
    // 添加新物品行的按钮事件
    $('#addItemBtn').click(function() {
    const newRow = $(`
        <tr>
            <td><div class="autocomplete"><input type="text" class="output-item"></div></td>
            <td><input type="number" class="output-probability" value="0" step="0.01"></td>
            <td><input type="number" class="output-price"></td>
            <td><input type="number" class="output-quantity" readonly></td>
            <td><input type="number" class="output-total" readonly></td>
        </tr>
    `);
    $('#outputItems').append(newRow);
    
    // 为新行设置自动完成，并绑定output模式
    const $outputItem = newRow.find('.output-item');
    setupAutocomplete($outputItem);
    
    // 如果默认有值，获取价格（使用output模式）
    if ($outputItem.val()) {
        const itemId = findItemIdByName($outputItem.val());
        if (itemId) {
            fetchItemPrice(itemId, newRow.find('.output-price'), 'output');
        }
    }
});
	function updateAllPrices() {
    // 更新转换物品价格
    const inputItem = $('.alchemy-text').val();
    if (inputItem) {
        const itemId = findItemIdByName(inputItem);
        if (itemId) {
            fetchItemPrice(itemId, $('#itemPrice'), currentMaterialMode);
        }
    }

    // 更新所有产出物品价格
    $('.output-item').each(function() {
        const itemName = $(this).val();
        if (itemName) {
            const itemId = findItemIdByName(itemName);
            if (itemId) {
                fetchItemPrice(
                    itemId,
                    $(this).closest('tr').find('.output-price'),
                    currentOutputMode
                );
            }
        }
    });
}
	// 催化剂价格获取
function fetchCatalystPrice(itemPath, priceInput) {
    if (!itemPath || !priceInput) return;
    
    priceInput.addClass('loading-price').prop('readonly', true);
    
    $.getJSON(`https://mooket.qi-e.top/market/item/price?name=${itemPath}`)    
        .always(() => {
            priceInput.removeClass('loading-price').prop('readonly', false);
        })
        .done((data) => {
            const price = currentMaterialMode === 'ask' ? data?.ask : data?.bid;
            priceInput.val(price || 0).trigger('change'); // 自动处理undefined
			updateTotalCost();
        })
        .fail(() => {
            priceInput.val('?').css('color', '#ff6b6b');
            setTimeout(() => priceInput.css('color', ''), 1000);
        });
}
	// 催化剂价格获取tigger		
$('#catalystType').change(function() {
    const selected = $(this).val().trim().toLowerCase(); // 标准化输入
    const $input = $('#Catalyst');    
    if (!selected) {
        $input.val(0).trigger('change');
		updateSuccessRate();
        return;
    }
    const fullPath = Object.keys(itemData).find(key => {
        const normalizedKey = key.toLowerCase().replace(/^\/|\/$/g, ''); // 去除首尾斜杠
        const segments = normalizedKey.split('/');
        return segments[segments.length - 1] === selected; // 严格匹配最后一段
    });
    if (fullPath) {
        fetchCatalystPrice(fullPath, $input);
		updateSuccessRate();
    } else {
        console.warn(`未找到催化剂路径: ${selected}`);
        $input.val(0).trigger('change');
		updateSuccessRate();
    }
});
// 监听%
$('#nonesuccessRate').on('change input', function() {
    // 边界检查
    this.value = Math.min(100, Math.max(0, parseFloat(this.value) || 0));
    updateSuccessRate();
});
// 监听%tiger
$('#catalystType').trigger('change');
// 监听所有成本相关输入框
$('#itemPrice, #Catalyst, #costPerTry').on('change input', updateTotalCost);

// 价格刷新按钮也要触发计算
$('#refreshPricesBtn').click(function() {
    // 更新转换物品价格
    const inputItem = $('.alchemy-text').val();
    if (inputItem) {
        const itemId = findItemIdByName(inputItem);
        if (itemId) {
            fetchItemPrice(itemId, $('#itemPrice'), currentMaterialMode);
        }
    }

    // 更新催化剂价格
    const catalystType = $('#catalystType').val();
    if (catalystType) {
        $('#catalystType').trigger('change'); // 这会触发催化剂价格的重新获取
    }

    // 更新所有产出物品价格
    $('.output-item').each(function() {
        const itemName = $(this).val();
        if (itemName) {
            const itemId = findItemIdByName(itemName);
            if (itemId) {
                fetchItemPrice(
                    itemId,
                    $(this).closest('tr').find('.output-price'),
                    currentOutputMode
                );
            }
        }
    });
    
    // 添加一个简单的视觉反馈
    $(this).text('刷新中...').css('opacity', '0.7');
    setTimeout(() => {
        $(this).text('刷新价格').css('opacity', '1');
    }, 500);
});
// 监听转换物品输入框的变化自动填充
});