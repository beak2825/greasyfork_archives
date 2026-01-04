// ==UserScript==
// @name         Ocultar Pedidos Amazon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Oculta pedidos en el historial de Amazon.es con botones junto a cada pedido o ingresando números manualmente. Muestra nombres de artículos en la lista de ocultos, con el número de pedido en un tooltip. Oculta/restaura instantáneamente sin recargar.
// @author       boooi03
// @match        https://www.amazon.es/gp/css/order-history*
// @match        https://www.amazon.es/gp/*
// @match        https://www.amazon.es/your-orders/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544585/Ocultar%20Pedidos%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/544585/Ocultar%20Pedidos%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cargar números de pedido desde almacenamiento o usar lista vacía
    let orderNumbers = GM_getValue('hiddenOrders', []);
    let actualizarListaCallback = null; // Variable para almacenar la función actualizarLista

    // Función para guardar números de pedido
    function saveOrderNumbers() {
        GM_setValue('hiddenOrders', orderNumbers);
    }

    // Función para obtener el nombre del primer artículo de un pedido
    function getFirstItemName(orderElement) {
        const itemElement = orderElement.querySelector('.yohtmlc-product-title .a-link-normal');
        return itemElement ? itemElement.textContent.trim() || 'Artículo sin nombre' : 'Artículo sin nombre';
    }

    // Función para ocultar o mostrar pedidos
    function actualizarVisibilidadPedidos() {
        document.querySelectorAll('.yohtmlc-order-id').forEach(elem => {
            let spans = elem.querySelectorAll('span');
            let num = spans[spans.length - 1]?.textContent.trim();
            if (num) {
                let contenedor = elem.closest('li.order-card__list');
                if (contenedor) {
                    if (orderNumbers.includes(num)) {
                        contenedor.style.display = 'none'; // Ocultar si está en la lista
                    } else {
                        contenedor.style.display = ''; // Mostrar si no está
                        // Añadir botón de ocultar si no existe
                        if (!contenedor.querySelector('.hide-order-button')) {
                            const hideButton = document.createElement('button');
                            hideButton.className = 'hide-order-button';
                            hideButton.textContent = 'Ocultar';
                            hideButton.style.marginLeft = '10px';
                            hideButton.style.padding = '2px 5px';
                            hideButton.style.backgroundColor = '#888888'; // Gris medio
                            hideButton.style.border = 'none';
                            hideButton.style.borderRadius = '3px';
                            hideButton.style.cursor = 'pointer';
                            hideButton.style.fontSize = '11px';
                            hideButton.onclick = () => {
                                if (!orderNumbers.includes(num)) {
                                    orderNumbers.push(num);
                                    saveOrderNumbers();
                                    contenedor.style.display = 'none'; // Ocultar inmediatamente
                                    if (actualizarListaCallback) actualizarListaCallback(); // Actualizar lista
                                }
                            };
                            elem.appendChild(hideButton);
                        }
                    }
                }
            }
        });
    }

    // Crear interfaz para añadir pedidos manualmente
    function crearInterfaz() {
        // Evitar crear múltiples botones o contenedores
        if (document.getElementById('hide-order-container') || document.getElementById('floating-toggle-button')) return;

        // Crear botón flotante para alternar visibilidad
        const toggleButton = document.createElement('button');
        toggleButton.id = 'floating-toggle-button';
        toggleButton.textContent = 'Ocultar Pedidos';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.padding = '6px';
        toggleButton.style.backgroundColor = '#666666'; // Gris oscuro
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.width = '40px';
        toggleButton.style.height = '40px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';
        toggleButton.style.fontSize = '11px';

        // Crear contenedor para el formulario y lista
        const container = document.createElement('div');
        container.id = 'hide-order-container';
        container.style.margin = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#d3d3d3'; // Gris claro
        container.style.borderRadius = '5px';
        container.style.position = 'fixed';
        container.style.top = '60px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.display = 'none'; // Inicialmente oculto
        container.style.maxWidth = '300px';
        container.style.fontSize = '12px';

        // Input para número de pedido
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ej: 402-1234567-1234567';
        input.style.marginRight = '5px';
        input.style.padding = '5px';
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';
        input.style.fontSize = '12px';

        // Botón para ocultar pedido
        const button = document.createElement('button');
        button.textContent = 'Añadir a Ocultos';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#888888'; // Gris medio
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.width = '100%';
        button.style.marginTop = '5px';
        button.style.fontSize = '12px';

        // Lista para mostrar pedidos ocultos
        const list = document.createElement('ul');
        list.id = 'hidden-orders-list';
        list.style.marginTop = '10px';
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.maxHeight = '200px';
        list.style.overflowY = 'auto';

        // Actualizar lista de pedidos ocultos
        function actualizarLista() {
            list.innerHTML = '';
            orderNumbers.forEach(num => {
                // Buscar el artículo correspondiente al número de pedido
                let itemName = 'Artículo sin nombre';
                document.querySelectorAll('.yohtmlc-order-id').forEach(elem => {
                    let spans = elem.querySelectorAll('span');
                    let currentNum = spans[spans.length - 1]?.textContent.trim();
                    if (currentNum === num) {
                        let contenedor = elem.closest('li.order-card__list');
                        if (contenedor) {
                            itemName = getFirstItemName(contenedor);
                        }
                    }
                });

                const li = document.createElement('li');
                li.style.marginBottom = '5px';
                li.textContent = itemName.length > 50 ? itemName.substring(0, 47) + '...' : itemName; // Limitar longitud
                li.title = num; // Mostrar número de pedido en tooltip
                li.style.fontSize = '12px';
                li.style.cursor = 'pointer'; // Indicar que tiene tooltip
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Eliminar';
                removeButton.style.marginLeft = '10px';
                removeButton.style.backgroundColor = '#a94442'; // Rojo grisáceo
                removeButton.style.border = 'none';
                removeButton.style.borderRadius = '3px';
                removeButton.style.cursor = 'pointer';
                removeButton.style.padding = '2px 5px';
                removeButton.style.fontSize = '11px';
                removeButton.onclick = () => {
                    orderNumbers = orderNumbers.filter(order => order !== num);
                    saveOrderNumbers();
                    actualizarLista();
                    // Restaurar visibilidad del pedido inmediatamente
                    document.querySelectorAll('.yohtmlc-order-id').forEach(elem => {
                        let spans = elem.querySelectorAll('span');
                        let currentNum = spans[spans.length - 1]?.textContent.trim();
                        if (currentNum === num) {
                            let contenedor = elem.closest('li.order-card__list');
                            if (contenedor) contenedor.style.display = ''; // Restaurar estilo por defecto
                        }
                    });
                    actualizarVisibilidadPedidos(); // Refrescar botones y visibilidad
                };
                li.appendChild(removeButton);
                list.appendChild(li);
            });
        }

        // Guardar la función actualizarLista para usarla desde actualizarVisibilidadPedidos
        actualizarListaCallback = actualizarLista;

        // Acción del botón para añadir pedido manualmente
        button.onclick = () => {
            const orderNum = input.value.trim();
            if (orderNum && orderNum.match(/^\d{3}-\d{7}-\d{7}$/) && !orderNumbers.includes(orderNum)) {
                orderNumbers.push(orderNum);
                saveOrderNumbers();
                input.value = '';
                actualizarLista();
                actualizarVisibilidadPedidos(); // Ocultar el pedido inmediatamente
            } else {
                alert('Por favor, introduce un número de pedido válido (formato: 123-1234567-1234567) y no duplicado.');
            }
        };

        // Acción del botón flotante para alternar visibilidad
        toggleButton.onclick = () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        };

        // Añadir elementos al contenedor
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(list);

        // Añadir botón y contenedor al cuerpo
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        // Mostrar lista inicial
        actualizarLista();
    }

    // Observar cambios en el DOM
    const observer = new MutationObserver(() => {
        actualizarVisibilidadPedidos();
        crearInterfaz();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Ejecutar al cargar
    actualizarVisibilidadPedidos();
    crearInterfaz();
})();