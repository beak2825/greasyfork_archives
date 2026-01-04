// ==UserScript==
// @name        wplace-infinite-bookmarks
// @name:ja         WPlace Unlimited Favorites⭐ - 無制限保存 & エクスポート機能
// @namespace   https://greasyfork.org/users/1508363
// @version     1.0.1
// @description WPlace Unlimited Favorites⭐ - Unlimited favorites storage on [WPlace.live], with backup & restore functionality, full Blue Marble support, integrated UI type
// @description:ja  WPlace.liveで無制限のお気に入り保存、バックアップ・復元機能付き、Blue Marble完全対応、UI統合型
// @author      Defaulter,gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://wplace.live/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM.getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547101/wplace-infinite-bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/547101/wplace-infinite-bookmarks.meta.js
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @main_begin{wplace-infinite-bookmarks}

const i18n = {
    ja: {
        "save_button": "保存",
        "modal_title": "お気に入り",
        "export": "エクスポート",
        "import": "インポート",
        "no_favorites_to_export": "エクスポートするお気に入りがありません",
        "favorites_exported": "件のお気に入りをエクスポートしました",
        "export_error": "エクスポートエラー",
        "import_error": "インポートエラー",
        "export_failed": "エクスポートに失敗しました",
        "import_failed": "インポートに失敗しました",
        "imported": "件のお気に入りをインポートしました",
        "invalid_file_format": "無効なファイル形式です",
        "confirm_import_1": "",
        "confirm_import_2": "件のお気に入りをインポートしますか？\n既存のデータは保持されます。",
        "unable_to_retrieve_location": "位置情報を取得できませんでした。マップをクリックしてから保存してください。",
        "enter_favorite_name": "お気に入り名を入力してください",
        "location": "地点",
        "location_retrieval_error": "位置取得エラー",
        "favorite_saved": "を保存しました",
        "favorite_retrieval_error": "お気に入り取得エラー",
        "confirm_delete": "このお気に入りを削除しますか？",
        "favorite_deleted": "削除しました",
        "favorite_count": "保存済み",
        "items": "件",
        "no_favorites": "お気に入りがありません",
        "add_favorites": "下の「保存」ボタンから追加してください",
    },
    en: {
        "save_button": "Save",
        "modal_title": "Favorites",
        "export": "Export",
        "import": "Import",
        "no_favorites_to_export": "No favorites to export",
        "favorites_exported": " favorites exported",
        "export_error": "Export error",
        "import_error": "Import error",
        "export_failed": "Export failed",
        "import_failed": "Import failed",
        "imported": " favorites imported",
        "invalid_file_format": "Invalid file format",
        "confirm_import_1": "Do you want to import",
        "confirm_import_2": "favorites?\nExisting data will be preserved.",
        "unable_to_retrieve_location": "Unable to retrieve location information. Please click on the map and then save.",
        "enter_favorite_name": "Please enter a name for the favorite",
        "location": "Location",
        "location_retrieval_error": "Location retrieval error",
        "favorite_saved": "Favorite saved",
        "favorite_retrieval_error": "Favorite retrieval error",
        "confirm_delete": "Are you sure you want to delete this favorite?",
        "favorite_deleted": "Deleted",
        "favorite_count": "Saved",
        "items": "items",
        "no_favorites": "No favorites",
        "add_favorites": "Please add from the 'Save' button below",
    },
    fr: {
        "save_button": "Enregistrer",
        "modal_title": "Favoris",
        "export": "Exporter",
        "import": "Importer",
        "no_favorites_to_export": "Aucun favori à exporter",
        "favorites_exported": " favoris exportés",
        "export_error": "Erreur d'exportation",
        "import_error": "Erreur d'importation",
        "export_failed": "Échec de l'exportation",
        "import_failed": "Échec de l'importation",
        "imported": " favoris importés",
        "invalid_file_format": "Format de fichier invalide",
        "confirm_import_1": "Voulez-vous importer",
        "confirm_import_2": "favoris ?\nLes données existantes seront préservées.",
        "unable_to_retrieve_location": "Impossible de récupérer les informations de localisation. Veuillez cliquer sur la carte puis enregistrer.",
        "enter_favorite_name": "Veuillez entrer un nom pour le favori",
        "location": "Emplacement",
        "location_retrieval_error": "Erreur de récupération de la localisation",
        "favorite_saved": "Favori enregistré",
        "favorite_retrieval_error": "Erreur de récupération des favoris",
        "confirm_delete": "Êtes-vous sûr de vouloir supprimer ce favori ?",
        "favorite_deleted": "Supprimé",
        "favorite_count": "Enregistré",
        "items": "éléments",
        "no_favorites": "Aucun favori",
        "add_favorites": "Veuillez ajouter depuis le bouton 'Enregistrer' ci-dessous",
    },
    es: {
        "save_button": "Guardar",
        "modal_title": "Favoritos",
        "export": "Exportar",
        "import": "Importar",
        "no_favorites_to_export": "No hay favoritos para exportar",
        "favorites_exported": " favoritos exportados",
        "export_error": "Error de exportación",
        "import_error": "Error de importación",
        "export_failed": "Error al exportar",
        "import_failed": "Error al importar",
        "imported": " favoritos importados",
        "invalid_file_format": "Formato de archivo inválido",
        "confirm_import_1": "¿Desea importar",
        "confirm_import_2": "favoritos?\nLos datos existentes se conservarán.",
        "unable_to_retrieve_location": "No se puede recuperar la información de ubicación. Haga clic en el mapa y luego guarde.",
        "enter_favorite_name": "Por favor, ingrese un nombre para el favorito",
        "location": "Ubicación",
        "location_retrieval_error": "Error al recuperar la ubicación",
        "favorite_saved": "Favorito guardado",
        "favorite_retrieval_error": "Error al recuperar los favoritos",
        "confirm_delete": "¿Está seguro de que desea eliminar este favorito?",
        "favorite_deleted": "Eliminado",
        "favorite_count": "Guardado",
        "items": "elementos",
        "no_favorites": "No hay favoritos",
        "add_favorites": "Por favor, agregue desde el botón 'Guardar' a continuación",
    }
};

const getLang = (i18n) => {
    const userLang = (navigator.languages && navigator.languages.length)
        ? navigator.languages[0]
        : navigator.language;
    const langKey = userLang.split("-")[0];

    return i18n[langKey] || i18n['en'];
}

const _ = getLang(i18n);

class WPlaceExtendedFavorites {
    constructor() {
        this.STORAGE_KEY = 'wplace_extended_favorites';
        this.init();
    }

    init() {
        this.observeAndInit();
    }

    observeAndInit() {
        // Button configurations
        const buttonConfigs = [
            {
                id: 'favorite-btn',
                selector: `[title="${_.modal_title}"]`,
                containerSelector: 'button[title="Toggle art opacity"]',
                create: this.createFavoriteButton.bind(this)
            },
            {
                id: 'save-btn',
                selector: '[data-wplace-save="true"]',
                containerSelector: '.hide-scrollbar.flex.max-w-full.gap-1\\.5.overflow-x-auto',
                create: this.createSaveButton.bind(this)
            }
        ];

        // Start generic button observer
        this.startButtonObserver(buttonConfigs);

        // Create modal
        setTimeout(() => this.createModal(), 2000);
    }

    // Generic Button Observer System
    startButtonObserver(configs) {
        const ensureButtons = () => {
            configs.forEach(config => {
                if (!document.querySelector(config.selector)) {
                    const container = document.querySelector(config.containerSelector);
                    if (container) {
                        config.create(container);
                    }
                }
            });
        };

        // Observe DOM changes
        const observer = new MutationObserver(() => {
            setTimeout(ensureButtons, 100);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial placement & periodic check
        setTimeout(ensureButtons, 1000);
        setInterval(ensureButtons, 5000);
    }

    // Create Favorite Button
    createFavoriteButton(toggleButton) {
        const container = toggleButton.parentElement;
        if (!container) return;

        const button = document.createElement('button');
        button.className = 'btn btn-lg sm:btn-xl btn-square shadow-md text-base-content/80 ml-2 z-30';
        button.title = _.modal_title;
        button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-5">
            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
        </svg>
    `;
        button.addEventListener('click', () => this.openModal());
        container.appendChild(button);
        console.log('⭐ Favorite button added');
    }

    // Create Save Button
    createSaveButton(container) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary btn-soft';
        button.setAttribute('data-wplace-save', 'true');
        button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-4.5">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
        ${_.save_button}
    `;
        button.addEventListener('click', () => this.addFavorite());
        container.appendChild(button);
        console.log('⭐ Save button added');
    }

    // Create Modal
    createModal() {
        const modal = document.createElement('dialog');
        modal.id = 'favorite-modal';
        modal.className = 'modal';

        modal.innerHTML = `
        <div class="modal-box max-w-4xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="flex items-center gap-1.5 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-5">
                    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                </svg>
                <h3 class="text-lg font-bold">${_.modal_title}</h3>
            </div>

            <!-- en: Export/Import Buttons -->
            <div class="flex gap-2 mb-4">
                <button id="export-btn" class="btn btn-outline btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-4">
                        <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                    ${_.export}
                </button>
                <button id="import-btn" class="btn btn-outline btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-4">
                        <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Z"/>
                    </svg>
                    ${_.import}
                </button>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            </div>

            <div id="favorites-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                <!-- Favorites will be displayed here -->
            </div>

            <div id="favorites-count" class="text-center text-sm text-base-content/80 mt-4">
                <!-- Favorites count will be displayed here -->
            </div>
        </div>

        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    `;

        document.body.appendChild(modal);

        // Event listener for existing grid clicks
        modal.querySelector('#favorites-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.favorite-card');
            const deleteBtn = e.target.closest('.delete-btn');

            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                this.deleteFavorite(id);
            } else if (card) {
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);
                const zoom = parseFloat(card.dataset.zoom);
                this.goTo(lat, lng, zoom);
                modal.close();
            }
        });

        // Export & Import event listeners
        modal.querySelector('#export-btn').addEventListener('click', () => this.exportFavorites());
        modal.querySelector('#import-btn').addEventListener('click', () => this.importFavorites());
    }

    // Export Function
    async exportFavorites() {
        try {
            const favorites = await this.getFavorites();

            if (favorites.length === 0) {
                this.showToast(_.no_favorites_to_export);
                return;
            }

            const exportData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                count: favorites.length,
                favorites: favorites
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `wplace-favorites-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            this.showToast(`${favorites.length}${_.favorites_exported}`);

        } catch (error) {
            console.error(`${_.export_error}:`, error);
            this.showToast(_.export_failed);
        }
    }

    // Import Function
    importFavorites() {
        const fileInput = document.getElementById('import-file');
        fileInput.click();

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const importData = JSON.parse(text);

                // Data format check
                if (!importData.favorites || !Array.isArray(importData.favorites)) {
                    throw new Error(_.invalid_file_format);
                }

                const currentFavorites = await this.getFavorites();
                const importCount = importData.favorites.length;

                if (!confirm(`${_.confirm_import_1} ${importCount} ${_.confirm_import_2}`)) {
                    return;
                }

                // Duplicate check (exclude those with the same coordinates)
                const newFavorites = importData.favorites.filter(importFav => {
                    return !currentFavorites.some(existing =>
                        Math.abs(existing.lat - importFav.lat) < 0.001 &&
                        Math.abs(existing.lng - importFav.lng) < 0.001
                    );
                });

                // Reassign new IDs (integers)
                newFavorites.forEach((fav, index) => {
                    fav.id = Date.now() + index;
                });

                // Merge and save
                const mergedFavorites = [...currentFavorites, ...newFavorites];
                await GM.setValue(this.STORAGE_KEY, JSON.stringify(mergedFavorites));

                this.renderFavorites();
                this.showToast(`${newFavorites.length}${_.imported}`);

            } catch (error) {
                console.error(`${_.import_error}:`, error);
                this.showToast(`${_.import_failed}: ` + error.message);
            }

            // Clear file input
            fileInput.value = '';
        };
    }

    // Open Modal
    openModal() {
        this.renderFavorites();
        document.getElementById('favorite-modal').showModal();
    }

    // Get Current Position
    getCurrentPosition() {
        try {
            const locationStr = localStorage.getItem('location');
            if (locationStr) {
                const location = JSON.parse(locationStr);
                return {
                    lat: location.lat,
                    lng: location.lng,
                    zoom: location.zoom
                };
            }
        } catch (error) {
            console.error(`${_.location_retrieval_error}:`, error);
        }
        return null;
    }

    // Add Favorite
    async addFavorite() {
        const position = this.getCurrentPosition();
        if (!position) {
            alert(_.unable_to_retrieve_location);
            return;
        }

        const name = prompt(`${_.enter_favorite_name}:`, `${_.location} (${position.lat.toFixed(3)}, ${position.lng.toFixed(3)})`);
        if (!name) return;

        const favorite = {
            id: Date.now(),
            name: name,
            lat: position.lat,
            lng: position.lng,
            zoom: position.zoom || 14,
            date: new Date().toLocaleDateString('ja-JP')
        };

        const favorites = await this.getFavorites();
        favorites.push(favorite);
        await GM.setValue(this.STORAGE_KEY, JSON.stringify(favorites));

        // Notification
        this.showToast(`"${name}" ${_.favorite_saved}`);
    }

    // Get Favorites List
    async getFavorites() {
        try {
            const stored = await GM.getValue(this.STORAGE_KEY, '[]');
            return JSON.parse(stored);
        } catch (error) {
            console.error(`${_.favorite_retrieval_error}:`, error);
            return [];
        }
    }

    // Render Favorites List
    async renderFavorites() {
        const favorites = await this.getFavorites();
        const grid = document.getElementById('favorites-grid');
        const count = document.getElementById('favorites-count');

        if (!grid || !count) return;

        count.textContent = `${_.favorite_count}: ${favorites.length} ${_.items}`;

        if (favorites.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-12 mx-auto mb-4 text-base-content/50">
                        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                    </svg>
                    <p class="text-base-content/80">${_.no_favorites}</p>
                    <p class="text-sm text-base-content/60">${_.add_favorites}</p>
                </div>
            `;
            return;
        }

        // Sort by newest first
        favorites.sort((a, b) => b.id - a.id);

        grid.innerHTML = favorites.map(fav => `
            <div class="favorite-card card bg-base-200 shadow-sm hover:shadow-md cursor-pointer transition-all relative"
                 data-lat="${fav.lat}" data-lng="${fav.lng}" data-zoom="${fav.zoom}">
                <button class="delete-btn btn btn-ghost btn-xs btn-circle absolute right-1 top-1 z-10"
                        data-id="${fav.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-3">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </button>
                <div class="card-body p-3">
                    <h4 class="card-title text-sm line-clamp-2">${fav.name}</h4>
                    <div class="text-xs text-base-content/70 space-y-1">
                        <div>📍 ${fav.lat.toFixed(3)}, ${fav.lng.toFixed(3)}</div>
                        <div>📅 ${fav.date}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Go To Location
    goTo(lat, lng, zoom) {
        const url = new URL(window.location);
        url.searchParams.set('lat', lat);
        url.searchParams.set('lng', lng);
        url.searchParams.set('zoom', zoom);
        window.location.href = url.toString();
    }

    // Delete Favorite
    async deleteFavorite(id) {
        if (!confirm(`${_.confirm_delete}`)) return;

        const favorites = await this.getFavorites();
        const filtered = favorites.filter(fav => fav.id !== id);
        await GM.setValue(this.STORAGE_KEY, JSON.stringify(filtered));

        this.renderFavorites();
        this.showToast(`${_.favorite_deleted}`);
    }

    // Show Toast Notification
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-end z-50';
        toast.innerHTML = `
            <div class="alert alert-success">
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize
new WPlaceExtendedFavorites();
// @main_end{wplace-infinite-bookmarks}

console.log(`End - ${script_id}`)
