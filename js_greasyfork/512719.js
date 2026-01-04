// ==UserScript==
// @name         Gitlab plus
// @namespace    https://lukaszmical.pl/
// @version      2025-04-18
// @description  Gitlab utils
// @author       Łukasz Micał
// @match        https://gitlab.com/*
// @require      https://cdn.jsdelivr.net/combine/npm/preact@10.25.4/dist/preact.min.umd.min.js,npm/preact@10.25.4/hooks/dist/hooks.umd.min.js,npm/preact@10.25.4/jsx-runtime/dist/jsxRuntime.umd.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @downloadURL https://update.greasyfork.org/scripts/512719/Gitlab%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/512719/Gitlab%20plus.meta.js
// ==/UserScript==

// Vite helpers
const __defProp = Object.defineProperty;
const __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
const __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);

// App code
const { jsx, jsxs, Fragment } = this.jsxRuntime;
const { render } = this.preact;
const { useMemo, useState, useEffect, useRef, useCallback, useLayoutEffect } =
  this.preactHooks;

// libs/share/src/ui/GlobalStyle.ts
class GlobalStyle {
  static addStyle(key, styles) {
    const style =
      document.getElementById(key) ||
      (function () {
        const style22 = document.createElement('style');
        style22.id = key;
        document.head.appendChild(style22);
        return style22;
      })();
    style.textContent = styles;
  }
}

const style2 =
  '.glp-image-preview-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  visibility: hidden;\n  opacity: 0;\n  pointer-events: none;\n  z-index: 99999;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.glp-image-preview-modal.glp-modal-visible {\n  visibility: visible;\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.glp-image-preview-modal .glp-modal-close {\n  position: absolute;\n  z-index: 2;\n  top: 5px;\n  right: 5px;\n  color: black;\n  width: 30px;\n  height: 30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: white;\n  border-radius: 15px;\n  cursor: pointer;\n}\n\n';
const style1 =
  '.glp-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 99999;\n  display: none;\n  background: rgba(0, 0, 0, 0.6);\n  justify-content: center;\n  align-items: center;\n}\n\n.glp-modal.glp-modal-visible {\n  display: flex;\n}\n\n.glp-modal .glp-modal-content {\n  width: 700px;\n  max-width: 95vw;\n}\n\n.gl-new-dropdown-item.glp-active .gl-new-dropdown-item-content {\n  box-shadow: inset 0 0 0 2px var(--gl-focus-ring-outer-color), inset 0 0 0 3px var(--gl-focus-ring-inner-color), inset 0 0 0 1px var(--gl-focus-ring-inner-color);\n  background-color: var(--gl-dropdown-option-background-color-unselected-hover);\n  outline: none;\n}\n\n';
const style3 =
  '.glp-preview-modal {\n  position: fixed;\n  border-radius: .25rem;\n  max-width: 350px;\n  width: 350px;\n  min-height: 200px;\n  visibility: hidden;\n  opacity: 0;\n  transition: all .2s ease-out;\n  transition-property: visibility, opacity, transform;\n\n}\n\n.glp-preview-modal.glp-modal-visible {\n  visibility: visible;\n  opacity: 1;\n}\n\n.glp-preview-modal ::-webkit-scrollbar {\n  width: 5px;\n}\n\n.glp-preview-modal ::-webkit-scrollbar-track {\n  background: var(--gl-background-color-overlap);\n}\n\n\n.glp-preview-modal ::-webkit-scrollbar-thumb {\n  background: #888;\n  border-radius: 5px;\n}\n\n\n.glp-preview-modal ::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n\n.glp-preview-modal * {\n  max-width: 100%;\n}\n';

// apps/gitlab-plus/src/styles/index.ts
GlobalStyle.addStyle('glp-style', [style1, style2, style3].join('\n'));

// libs/share/src/store/Store.ts
class Store {
  constructor(key) {
    this.key = key;
  }

  get(defaultValue = void 0) {
    try {
      const data = localStorage.getItem(this.key);
      if (data) {
        return this.decode(data);
      }
      return defaultValue;
    } catch (_e) {
      return defaultValue;
    }
  }

  remove() {
    localStorage.removeItem(this.key);
  }

  set(value) {
    try {
      localStorage.setItem(this.key, this.encode(value));
    } catch (_e) {}
  }

  decode(val) {
    return JSON.parse(val);
  }

  encode(val) {
    return JSON.stringify(val);
  }
}

// libs/share/src/store/CacheHelper.ts
class CacheHelper {
  static clearInvalid(prefix) {
    for (const key in localStorage) {
      if (!key.startsWith(prefix)) {
        continue;
      }
      const item = new Store(key).get();
      if (!this.isCacheEntity(item)) {
        continue;
      }
      if (!this.isValid(item)) {
        new Store(key).remove();
      }
    }
  }

  static expirationDate(minutes) {
    if (typeof minutes === 'string') {
      return minutes;
    }
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time;
  }

  static isCacheEntity(item) {
    return !!item && typeof item === 'object' && 'expirationDate' in item;
  }

  static isValid(item) {
    if (item) {
      return (
        item.expirationDate === 'lifetime' ||
        new Date(item.expirationDate) > new Date()
      );
    }
    return false;
  }
}

// libs/share/src/store/Cache.ts
class Cache {
  constructor(prefix) {
    this.prefix = prefix;
  }

  get(key, defaultValue) {
    const data = new Store(this.createKey(key)).get();
    if (CacheHelper.isValid(data)) {
      return data.value;
    }
    return defaultValue;
  }

  set(key, value, minutes) {
    new Store(this.createKey(key)).set({
      expirationDate: CacheHelper.expirationDate(minutes),
      value,
    });
  }

  createKey(key) {
    return `${this.prefix}${key}`;
  }
}

// apps/gitlab-plus/src/consts/AppConfig.ts
var AppConfig = ((AppConfig2) => {
  AppConfig2['CachePrefix'] = 'glp-';
  return AppConfig2;
})(AppConfig || {});

// apps/gitlab-plus/src/consts/ServiceName.ts
var ServiceName = ((ServiceName2) => {
  ServiceName2['ClearCacheService'] = 'ClearCacheService';
  ServiceName2['CreateChildIssue'] = 'CreateChildIssue';
  ServiceName2['CreateRelatedIssue'] = 'CreateRelatedIssue';
  ServiceName2['EpicPreview'] = 'EpicPreview';
  ServiceName2['EpicStatus'] = 'EpicStatus';
  ServiceName2['ImagePreview'] = 'ImagePreview';
  ServiceName2['IssuePreview'] = 'IssuePreview';
  ServiceName2['IssueStatus'] = 'IssueStatus';
  ServiceName2['MrPreview'] = 'MrPreview';
  ServiceName2['RelatedIssueAutocomplete'] = 'RelatedIssueAutocomplete';
  ServiceName2['RelatedIssuesLabelStatus'] = 'RelatedIssuesLabelStatus';
  ServiceName2['SortIssue'] = 'SortIssue';
  ServiceName2['UserSettings'] = 'UserSettings';
  return ServiceName2;
})(ServiceName || {});
const servicesConfig = {
  ['ClearCacheService']: { label: 'Clear cache', required: true },
  ['CreateChildIssue']: {
    label: 'Create child issue form on epic page',
  },
  ['CreateRelatedIssue']: {
    label: 'Create related issue form on issue page',
  },
  ['EpicPreview']: { label: 'Epic preview modal' },
  ['EpicStatus']: { label: 'Epic status select' },
  ['ImagePreview']: { label: 'Image preview modal' },
  ['IssuePreview']: { label: 'Issue preview modal' },
  ['IssueStatus']: { label: 'Issue status select' },
  ['MrPreview']: { label: 'Merge request preview modal' },
  ['RelatedIssueAutocomplete']: {
    label: 'Related issue autocomplete in related issues input',
  },
  ['RelatedIssuesLabelStatus']: {
    label: 'Label status in related issues list items (old design)',
  },
  ['SortIssue']: {
    experimental: true,
    label: 'Sort issues in board',
  },
  ['UserSettings']: { label: 'User settings', required: true },
};

// apps/gitlab-plus/src/components/user-settings/UserConfig.ts
var UserConfig = ((UserConfig2) => {
  UserConfig2['StatusLabelPrefix'] = 'StatusLabelPrefix';
  return UserConfig2;
})(UserConfig || {});
const configLabels = {
  ['StatusLabelPrefix']: 'Status label prefix',
};
const defaultUserConfig = {
  ['StatusLabelPrefix']: 'Status::',
};

// apps/gitlab-plus/src/components/user-settings/UserSettingsStore.ts
const _UserSettingsStore = class _UserSettingsStore {
  constructor() {
    __publicField(this, 'store', new Cache(AppConfig.CachePrefix));
  }

  getConfig(name2) {
    return this.getConfigItem(name2);
  }

  isActive(name2) {
    if (!(name2 in servicesConfig)) {
      return false;
    }
    if (servicesConfig[name2].required) {
      return true;
    }
    if (servicesConfig[name2].experimental) {
      return this.getConfigItem(name2, false);
    }
    return this.getConfigItem(name2, true);
  }

  setConfig(name2, value) {
    this.setConfigItem(name2, value);
  }

  setIsActive(name2, value) {
    this.setConfigItem(name2, value);
  }

  getConfigItem(key, defaultValue) {
    const items = this.getConfigItems();
    if (items[key] === void 0) {
      return defaultValue;
    }
    return items[key];
  }

  getConfigItems() {
    return {
      ...defaultUserConfig,
      ...this.store.get(_UserSettingsStore.ConfigKey, {}),
    };
  }

  setConfigItem(key, value) {
    const items = this.getConfigItems();
    this.store.set(
      _UserSettingsStore.ConfigKey,
      {
        ...items,
        [key]: value,
      },
      'lifetime'
    );
  }
};
__publicField(_UserSettingsStore, 'ConfigKey', 'app-config');
const UserSettingsStore = _UserSettingsStore;
const userSettingsStore = new UserSettingsStore();

// apps/gitlab-plus/src/services/BaseService.ts
class BaseService {
  constructor() {
    __publicField(this, 'ready', false);
  }

  setup(callback, linkValidator) {
    if (linkValidator && !linkValidator(window.location.href)) {
      return;
    }
    callback();
    [1, 3, 5].forEach((time) => {
      window.setTimeout(() => {
        if (!this.ready) {
          callback();
        }
      }, time * 1e3);
    });
  }
}

// apps/gitlab-plus/src/services/ClearCacheService.ts
class ClearCacheService extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.ClearCacheService);
  }

  init() {
    this.invalidateCache();
    window.setInterval(this.invalidateCache.bind(this), 60 * 1e3);
  }

  invalidateCache() {
    CacheHelper.clearInvalid(AppConfig.CachePrefix);
  }
}

// apps/gitlab-plus/src/components/common/modal/events.ts
var ModalEvents = ((ModalEvents2) => {
  ModalEvents2['showChildIssueModal'] = 'glp-show-create-child-issue-modal';
  ModalEvents2['showRelatedIssueModal'] = 'glp-show-create-issue-modal';
  ModalEvents2['showUserSettingsModal'] = 'glp-show-user-settings-modal';
  return ModalEvents2;
})(ModalEvents || {});

// libs/share/src/utils/clsx.ts
function clsx(...args) {
  return args
    .map((item) => {
      if (!item) {
        return '';
      }
      if (typeof item === 'string') {
        return item;
      }
      if (Array.isArray(item)) {
        return clsx(...item);
      }
      if (typeof item === 'object') {
        return clsx(
          Object.entries(item)
            .filter(([_, value]) => value)
            .map(([key]) => key)
        );
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

// apps/gitlab-plus/src/components/common/GitlabIcon.tsx
const buildId =
  '236e3b687d786d9dfe4709143a94d4c53b8d5a1f235775401e5825148297fa84';
const iconUrl = (icon) => {
  let _a;
  const svgSprite =
    ((_a = unsafeWindow.gon) == null ? void 0 : _a.sprite_icons) ||
    `/assets/icons-${buildId}.svg`;
  return `${svgSprite}#${icon}`;
};

function GitlabIcon({ className, icon, size = 12, title }) {
  return jsx('svg', {
    className: clsx('gl-icon gl-fill-current', `s${size}`, className),
    title,
    children: jsx('use', { href: iconUrl(icon) }),
  });
}

// apps/gitlab-plus/src/components/common/base/Row.tsx
function Row({ children, className, gap, items, justify }) {
  return jsx('div', {
    class: clsx(
      'gl-flex gl-flex-row',
      justify && `gl-justify-${justify}`,
      items && `gl-items-${items}`,
      gap && `gl-gap-${gap}`,
      className
    ),
    children,
  });
}

// apps/gitlab-plus/src/components/common/GitlabLoader.tsx
function GitlabLoader({ asOverlay, size = 24 }) {
  const loader = useMemo(() => {
    return jsx('span', {
      class: 'gl-spinner-container',
      role: 'status',
      children: jsx('span', {
        class: 'gl-spinner gl-spinner-sm gl-spinner-dark !gl-align-text-bottom',
        style: {
          width: size,
          height: size,
        },
      }),
    });
  }, [size]);
  if (asOverlay) {
    return jsx(Row, {
      className: 'gl-h-full gl-w-full gl-absolute gl-bg-overlay',
      items: 'center',
      justify: 'center',
      children: loader,
    });
  }
  return loader;
}

// apps/gitlab-plus/src/components/common/GitlabButton.tsx
const buttonVariantClass = {
  default: 'btn-default',
  info: 'btn-confirm',
  tertiary: 'btn-default-tertiary',
};

function GitlabButton({
  children,
  className,
  icon,
  iconSize = 12,
  isLoading,
  onClick,
  size = 'sm',
  title,
  variant = 'default',
}) {
  const IconComponent = useMemo(() => {
    if (isLoading) {
      return jsx(GitlabLoader, { size: iconSize });
    }
    if (icon) {
      return jsx(GitlabIcon, { icon, size: iconSize });
    }
    return null;
  }, [icon, isLoading]);
  return jsxs('button', {
    onClick,
    title,
    type: 'button',
    class: clsx(
      `btn btn-${size} gl-button`,
      buttonVariantClass[variant],
      className
    ),
    children: [
      children && jsx('span', { class: 'gl-button-text', children }),
      IconComponent,
    ],
  });
}

// apps/gitlab-plus/src/components/common/CloseButton.tsx
function CloseButton({ onClick, title = 'Close' }) {
  return jsx(GitlabButton, {
    className: 'btn-icon',
    icon: 'close-xs',
    iconSize: 16,
    onClick,
    title,
    variant: 'tertiary',
  });
}

// apps/gitlab-plus/src/components/common/modal/GlpModal.tsx
function GlpModal({ children, isVisible, onClose, title }) {
  return jsx('div', {
    class: clsx('glp-modal', isVisible && 'glp-modal-visible'),
    children: jsxs('div', {
      className: clsx(
        'glp-modal-content crud gl-border',
        'gl-rounded-form gl-border-section gl-bg-subtle gl-mt-5'
      ),
      children: [
        jsxs('div', {
          className: clsx(
            'crud-header gl-border-b gl-flex gl-flex-wrap',
            'gl-justify-between gl-gap-x-5 gl-gap-y-2 gl-rounded-t-form',
            'gl-border-section gl-bg-section gl-px-5 gl-py-4 gl-relative'
          ),
          children: [
            jsx('h2', {
              className: clsx(
                'gl-m-0 gl-inline-flex gl-items-center gl-gap-3',
                'gl-text-form gl-font-bold gl-leading-normal'
              ),
              children: title,
            }),
            jsx(CloseButton, { onClick: onClose }),
          ],
        }),
        children,
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/common/modal/useGlpModal.ts
function useGlpModal(eventName) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    document.addEventListener(eventName, () => setIsVisible(true));
  }, []);
  return {
    isVisible,
    onClose: () => setIsVisible(false),
  };
}

// apps/gitlab-plus/src/components/common/base/Text.tsx
function Text({ children, className, color, size, variant, weight }) {
  return jsx('span', {
    class: clsx(
      size && `gl-text-${size}`,
      weight && `gl-font-${weight}`,
      variant && `gl-text-${variant}`,
      color && `gl-text-${color}`,
      className
    ),
    children,
  });
}

// apps/gitlab-plus/src/components/common/form/FormField.tsx
function FormField({ children, error, hint, title }) {
  return jsxs('fieldset', {
    class: clsx(
      'form-group gl-form-group gl-w-full',
      error && 'gl-show-field-errors'
    ),
    children: [
      jsx('legend', {
        class: 'bv-no-focus-ring col-form-label pt-0 col-form-label',
        children: title,
      }),
      children,
      Boolean(!error && hint) && jsx('small', { children: hint }),
      Boolean(error) &&
        jsx('small', { class: 'gl-field-error', children: error }),
    ],
  });
}

// apps/gitlab-plus/src/components/common/form/FormRow.tsx
function FormRow({ children }) {
  return jsx('div', { class: 'gl-flex gl-gap-x-3', children });
}

// libs/share/src/utils/camelizeKeys.ts
function camelizeKeys(data) {
  if (!data || ['string', 'number', 'boolean'].includes(typeof data)) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(camelizeKeys);
  }
  const camelize = (key) => {
    const _key = key.replace(/[-_\s]+(.)?/g, (_, chr) =>
      chr ? chr.toUpperCase() : ''
    );
    return _key.substring(0, 1).toLowerCase() + _key.substring(1);
  };
  return Object.entries(data).reduce(
    (result, [key, value]) => ({
      ...result,
      [camelize(key)]: camelizeKeys(value),
    }),
    {}
  );
}

// apps/gitlab-plus/src/providers/GitlabProvider.ts
class GitlabProvider {
  constructor(force = false) {
    __publicField(this, 'cache', new Cache(AppConfig.CachePrefix));
    __publicField(this, 'graphqlApi', 'https://gitlab.com/api/graphql');
    __publicField(this, 'url', 'https://gitlab.com/api/v4/');
    this.force = force;
  }

  async cached(key, getValue, minutes) {
    const cacheValue = this.cache.get(key);
    if (cacheValue && !this.force) {
      return cacheValue;
    }
    const value = await getValue();
    this.cache.set(key, value, minutes);
    return value;
  }

  csrf() {
    const token = document.querySelector('meta[name=csrf-token]');
    if (token) {
      return token.getAttribute('content');
    }
    return '';
  }

  async get(path) {
    const response = await fetch(`${this.url}${path}`, {
      headers: this.headers(),
      method: 'GET',
    });
    const data = await response.json();
    return camelizeKeys(data);
  }

  async getCached(key, path, minutes) {
    return this.cached(key, () => this.get(path), minutes);
  }

  headers() {
    const headers = {
      'content-type': 'application/json',
    };
    const csrf = this.csrf();
    if (csrf) {
      headers['X-CSRF-Token'] = csrf;
    }
    return headers;
  }

  async post(path, body) {
    const response = await fetch(`${this.url}${path}`, {
      body: JSON.stringify(body),
      headers: this.headers(),
      method: 'POST',
    });
    const data = await response.json();
    return camelizeKeys(data);
  }

  async query(query, variables) {
    const response = await fetch(this.graphqlApi, {
      body: JSON.stringify({ query, variables }),
      headers: this.headers(),
      method: 'POST',
    });
    return response.json();
  }

  async queryCached(key, query, variables, minutes) {
    return this.cached(key, () => this.query(query, variables), minutes);
  }
}

// apps/gitlab-plus/src/providers/query/user.ts
const userFragment = `
fragment UserFragment on User {
  id
  avatarUrl
  name
  username
  webUrl
  webPath
}
`;
const userQuery = `
query workspaceAutocompleteUsersSearch($search: String!, $fullPath: ID!) {
  workspace: project(fullPath: $fullPath) {
    id
    users: autocompleteUsers(search: $search) {
      ...UserFragment
    }
  }
}

${userFragment}
`;
const currentUserQuery = `
query currentUser {
  currentUser  {
    ...UserFragment
  }
}

${userFragment}
`;

// apps/gitlab-plus/src/providers/UsersProvider.ts
class UsersProvider extends GitlabProvider {
  async getCurrentUser() {
    return this.queryCached('gitlab-current-user', currentUserQuery, {}, 60);
  }

  async getUsers(projectId, search = '') {
    return this.queryCached(
      `users-${projectId}-${search}`,
      userQuery,
      {
        fullPath: projectId,
        search,
      },
      search === '' ? 20 : 0.5
    );
  }
}

// apps/gitlab-plus/src/components/common/form/autocomplete/useAsyncAutocompleteButton.ts
function useAsyncAutocompleteButton(hide) {
  const ref = useRef(null);
  useEffect(() => {
    document.body.addEventListener('click', (e) => {
      if (
        ref.current &&
        e.target !== ref.current &&
        !ref.current.contains(e.target)
      ) {
        hide();
      }
    });
  }, []);
  return ref;
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocompleteButton.tsx
function AsyncAutocompleteButton({
  isOpen,
  renderLabel,
  reset,
  setIsOpen,
  size = 'md',
  value,
}) {
  const ref = useAsyncAutocompleteButton(() => setIsOpen(false));
  const icon = useMemo(() => {
    if (value.length) {
      return 'close-xs';
    }
    return isOpen ? 'chevron-lg-up' : 'chevron-lg-down';
  }, [isOpen, value]);
  return jsx('button', {
    class: `btn btn-default btn-${size} btn-block gl-button gl-new-dropdown-toggle`,
    ref,
    type: 'button',
    onClick: (e) => {
      e.preventDefault();
      setIsOpen(true);
    },
    children: jsxs('span', {
      class: 'gl-button-text gl-w-full',
      children: [
        jsx('span', {
          class: 'gl-new-dropdown-button-text',
          children: renderLabel(value),
        }),
        jsx('span', {
          onClick: (e) => {
            if (value.length) {
              e.preventDefault();
              reset();
            }
          },
          children: jsx(GitlabIcon, { icon, size: 16 }),
        }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocompleteOption.tsx
function AsyncAutocompleteOption({
  hideCheckbox = false,
  isActive,
  onClick,
  option,
  removeFromRecent,
  renderOption,
  selected,
}) {
  const selectedIds = selected.map((i) => i.id);
  const selectedClass = (id) => selectedIds.includes(id);
  return jsx('li', {
    onClick: () => onClick(option),
    class: clsx(
      'gl-new-dropdown-item',
      // selectedClass(option.id),
      isActive && 'glp-active'
    ),
    children: jsxs('span', {
      class: 'gl-new-dropdown-item-content',
      children: [
        !hideCheckbox &&
          jsx(GitlabIcon, {
            className: 'glp-item-check gl-pr-2',
            icon: selectedClass(option.id) ? 'mobile-issue-close' : '',
            size: 16,
          }),
        renderOption(option),
        removeFromRecent &&
          jsx(CloseButton, {
            title: 'Remove from recently used',
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFromRecent(option);
            },
          }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocompleteList.tsx
function AsyncAutocompleteList({
  hideCheckbox,
  activeIndex,
  onClick,
  options,
  recently,
  removeRecently,
  renderOption,
  value,
}) {
  return jsx('div', {
    onClick: (e) => e.stopPropagation(),
    class:
      'gl-new-dropdown-contents gl-new-dropdown-contents-with-scrim-overlay bottom-scrim-visible gl-new-dropdown-contents',
    style: {
      maxWidth: '800px',
      width: '100%',
      left: '0',
      top: '100%',
    },
    children: jsx('div', {
      class: 'gl-new-dropdown-inner',
      children: jsxs('ul', {
        class: 'gl-mb-0 gl-pl-0',
        children: [
          Boolean(recently.length) &&
            jsxs(Fragment, {
              children: [
                jsx('li', {
                  class:
                    'gl-pb-2 gl-pl-4 gl-pt-3 gl-text-sm gl-font-bold gl-text-strong',
                  children: 'Recently used',
                }),
                recently.map((item, index) =>
                  jsx(
                    AsyncAutocompleteOption,
                    {
                      hideCheckbox,
                      isActive: index === activeIndex,
                      onClick,
                      option: item,
                      removeFromRecent: removeRecently,
                      renderOption,
                      selected: value,
                    },
                    item.id
                  )
                ),
              ],
            }),
          Boolean(options.length) &&
            jsxs(Fragment, {
              children: [
                jsx('li', {
                  class:
                    'gl-pb-2 gl-pl-4 gl-pt-3 gl-text-sm gl-font-bold gl-text-strong gl-border-t',
                }),
                options.map((item, index) =>
                  jsx(
                    AsyncAutocompleteOption,
                    {
                      hideCheckbox,
                      isActive: recently.length + index === activeIndex,
                      onClick,
                      option: item,
                      renderOption,
                      selected: value,
                    },
                    item.id
                  )
                ),
              ],
            }),
          options.length + recently.length === 0 &&
            jsx('li', { class: 'gl-p-4', children: 'No options' }),
        ],
      }),
    }),
  });
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocompleteSearch.tsx
function AsyncAutocompleteSearch({ navigate, setValue, value }) {
  return jsx('div', {
    class: 'gl-border-b-1 gl-border-b-solid gl-border-b-dropdown',
    children: jsxs('div', {
      class: 'gl-listbox-search gl-listbox-topmost',
      children: [
        jsx(GitlabIcon, {
          className: 'gl-search-box-by-type-search-icon',
          icon: 'search',
          size: 16,
        }),
        jsx('input', {
          class: 'gl-listbox-search-input',
          onInput: (e) => setValue(e.target.value),
          onKeyDown: (e) => navigate(e.key),
          value,
          autofocus: true,
        }),
        Boolean(value) &&
          jsx('div', {
            class: 'gl-search-box-by-type-right-icons',
            style: { top: '0' },
            children: jsx(CloseButton, {
              onClick: () => setValue(''),
              title: 'Clear input',
            }),
          }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/common/form/autocomplete/useListNavigate.ts
function useListNavigate(options, recent, onClick, onClose) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = (key) => {
    if (['ArrowDown', 'ArrowUp'].includes(key)) {
      const total = recent.length + options.length;
      const diff = key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((activeIndex + diff + total) % total);
    } else if (key === 'Enter') {
      const allItems = [...recent, ...options];
      if (-1 < activeIndex && activeIndex < allItems.length) {
        onClick(allItems[activeIndex]);
      }
    } else if (key === 'Escape') {
      onClose();
    }
  };
  return {
    activeIndex,
    navigate,
  };
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocompleteDropdown.tsx
function AsyncAutocompleteDropdown({
  hideCheckbox,
  onClick,
  onClose,
  options,
  recently = [],
  removeRecently,
  renderOption,
  searchTerm,
  setSearchTerm,
  value,
}) {
  const { activeIndex, navigate } = useListNavigate(
    options,
    recently,
    onClick,
    onClose
  );
  return jsx('div', {
    class: clsx('gl-new-dropdown-panel gl-absolute !gl-block'),
    onClick: (e) => e.stopPropagation(),
    style: {
      maxWidth: '800px',
      width: '100%',
      left: 'auto',
      right: '0',
      top: '100%',
    },
    children: jsxs('div', {
      class: 'gl-new-dropdown-inner',
      children: [
        jsx(AsyncAutocompleteSearch, {
          navigate,
          setValue: setSearchTerm,
          value: searchTerm,
        }),
        jsx(AsyncAutocompleteList, {
          hideCheckbox,
          activeIndex,
          onClick,
          options,
          recently,
          removeRecently,
          renderOption,
          value,
        }),
      ],
    }),
  });
}

// libs/share/src/utils/useDebounce.ts
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// apps/gitlab-plus/src/components/common/form/autocomplete/useAsyncAutocompleteOptions.ts
function useAsyncAutocompleteOptions(searchTerm, getValues) {
  const [options, setOptions] = useState([]);
  const term = useDebounce(searchTerm);
  const loadOptions = useCallback(
    async (term2) => {
      const items = await getValues(term2);
      setOptions(items);
    },
    [getValues]
  );
  useEffect(() => {
    loadOptions(term);
  }, [term, loadOptions]);
  return options;
}

// apps/gitlab-plus/src/providers/RecentlyProvider.ts
class RecentlyProvider {
  constructor(key) {
    __publicField(this, 'cache', new Cache(AppConfig.CachePrefix));
    __publicField(this, 'key');
    __publicField(this, 'eventName');
    this.key = `recently-${key}`;
    this.eventName = `recently-${key}-change`;
  }

  add(...items) {
    const itemsId = items.map((i) => i.id);
    this.cache.set(
      this.key,
      [...items, ...this.get().filter((el) => !itemsId.includes(el.id))],
      'lifetime'
    );
    this.triggerChange();
  }

  get() {
    return this.cache.get(this.key) || [];
  }

  onChange(callback) {
    document.addEventListener(this.eventName, callback);
  }

  remove(...items) {
    const itemsId = items.map((i) => i.id);
    this.cache.set(
      this.key,
      this.get().filter((el) => !itemsId.includes(el.id)),
      'lifetime'
    );
    this.triggerChange();
  }

  triggerChange() {
    document.dispatchEvent(new CustomEvent(this.eventName));
  }
}

// apps/gitlab-plus/src/components/common/form/autocomplete/useAsyncAutocompleteRecently.ts
function useAsyncAutocompleteRecently(name2) {
  const store = useRef(new RecentlyProvider(name2));
  const [recently, setRecently] = useState(store.current.get());
  useEffect(() => {
    store.current.onChange(() => {
      setRecently(store.current.get());
    });
  }, []);
  return {
    add: store.current.add.bind(store.current),
    recently,
    remove: store.current.remove.bind(store.current),
  };
}

// apps/gitlab-plus/src/components/common/form/autocomplete/useAsyncAutocomplete.ts
function useAsyncAutocomplete(
  name2,
  value,
  getValues,
  onChange,
  isMultiselect
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { recently: allRecently, remove: removeRecently } =
    useAsyncAutocompleteRecently(name2);
  const options = useAsyncAutocompleteOptions(searchTerm, getValues);
  const onClick = (item) => {
    if (isMultiselect) {
      if (value.find((i) => i.id === item.id)) {
        onChange(value.filter((i) => i.id !== item.id));
      } else {
        onChange([...value, item]);
      }
    } else {
      onChange([item]);
      setIsOpen(false);
    }
  };
  const recently = useMemo(() => {
    const optionsIds = options.map((i) => i.id);
    return searchTerm.length
      ? allRecently.filter((i) => optionsIds.includes(i.id))
      : allRecently;
  }, [options, allRecently]);
  return {
    isOpen,
    onClick,
    options: useMemo(() => {
      const recentlyIds = recently.map((i) => i.id);
      return options.filter((i) => !recentlyIds.includes(i.id));
    }, [options, recently]),
    recently,
    removeRecently,
    searchTerm,
    setIsOpen,
    setSearchTerm,
  };
}

// apps/gitlab-plus/src/components/common/form/autocomplete/AsyncAutocomplete.tsx
function AsyncAutocomplete({
  hideCheckbox = false,
  buttonSize,
  getValues,
  isDisabled,
  isMultiselect = false,
  name: name2,
  onChange,
  renderLabel,
  renderOption,
  value,
}) {
  const {
    isOpen,
    onClick,
    options,
    recently,
    removeRecently,
    searchTerm,
    setIsOpen,
    setSearchTerm,
  } = useAsyncAutocomplete(name2, value, getValues, onChange, isMultiselect);
  return jsxs('div', {
    class: clsx(
      'gl-relative gl-w-full gl-new-dropdown !gl-block',
      isDisabled && 'gl-pointer-events-none gl-opacity-5'
    ),
    children: [
      jsx(AsyncAutocompleteButton, {
        isOpen,
        renderLabel,
        reset: () => onChange([]),
        setIsOpen,
        size: buttonSize,
        value,
      }),
      isOpen &&
        jsx(AsyncAutocompleteDropdown, {
          hideCheckbox,
          onClick,
          onClose: () => setIsOpen(false),
          options,
          recently,
          removeRecently,
          renderOption,
          searchTerm,
          setSearchTerm,
          value,
        }),
    ],
  });
}

// apps/gitlab-plus/src/components/common/GitlabUser.tsx
function GitlabUser({ showUsername, size = 24, smallText, user, withLink }) {
  const label = useMemo(() => {
    return jsxs(Fragment, {
      children: [
        jsx('span', {
          class: clsx('gl-mr-2 gl-block', smallText && '!gl-text-sm'),
          children: user.name,
        }),
        showUsername &&
          jsx('span', {
            class: 'gl-block gl-text-secondary !gl-text-sm',
            children: user.username,
          }),
      ],
    });
  }, [smallText, showUsername, user]);
  const iconClsx = [
    `gl-avatar gl-avatar-s${size}`,
    smallText ? 'gl-mr-1' : 'gl-mr-3',
  ];
  return jsxs('div', {
    class: 'gl-flex gl-items-center',
    children: [
      user.avatarUrl
        ? jsx('img', {
            alt: `${user.name}'s avatar`,
            class: clsx(...iconClsx, `gl-avatar-circle`),
            src: user.avatarUrl,
          })
        : jsx('div', {
            class: clsx(
              ...iconClsx,
              `gl-avatar-identicon gl-avatar-identicon-bg1`
            ),
            children: user.name[0].toUpperCase(),
          }),
      withLink
        ? jsx('a', { href: user.webUrl, children: label })
        : jsx('div', { children: label }),
    ],
  });
}

// apps/gitlab-plus/src/components/create-issue/fields/AssigneesField.tsx
function AssigneesField({ projectPath, setValue, value }) {
  const getUsers = useCallback(
    async (search) => {
      if (!projectPath) {
        return [];
      }
      const response = await new UsersProvider().getUsers(projectPath, search);
      return response.data.workspace.users;
    },
    [projectPath]
  );
  const renderLabel = useCallback((items) => {
    const label = items.map((i) => i.name).join(', ');
    return jsx('div', {
      title: label,
      children: items.length ? label : 'Select assignee',
    });
  }, []);
  const renderOption = useCallback((item) => {
    return jsx('span', {
      class: 'gl-new-dropdown-item-text-wrapper',
      children: jsx(GitlabUser, { user: item, showUsername: true }),
    });
  }, []);
  return jsx(AsyncAutocomplete, {
    getValues: getUsers,
    isDisabled: !projectPath,
    name: 'assignees',
    onChange: setValue,
    renderLabel,
    renderOption,
    value,
    isMultiselect: true,
  });
}

// apps/gitlab-plus/src/components/create-issue/fields/ButtonField.tsx
function ButtonField({ create, isLoading, reset }) {
  return jsxs(Fragment, {
    children: [
      jsxs('button', {
        class: 'btn btn-confirm btn-sm gl-button gl-gap-2',
        disabled: isLoading,
        onClick: create,
        type: 'button',
        children: [
          jsx('span', { class: 'gl-button-text', children: 'Add' }),
          isLoading
            ? jsx(GitlabLoader, { size: 12 })
            : jsx(GitlabIcon, { icon: 'plus', size: 12 }),
        ],
      }),
      jsx('button', {
        class: 'btn btn-sm gl-button',
        onClick: reset,
        type: 'button',
        children: jsx('span', { class: 'gl-button-text', children: 'Reset' }),
      }),
    ],
  });
}

// apps/gitlab-plus/src/providers/query/iteration.ts
const iterationFragment = `fragment IterationFragment on Iteration {
  id
  title
  startDate
  dueDate
  webUrl
  state
  iterationCadence {
    id
    title
  }
}`;
const iterationQuery = `query issueIterationsAliased($fullPath: ID!, $title: String, $state: IterationState) {
  workspace: group(fullPath: $fullPath) {
    id
    attributes: iterations(
      search: $title
      in: [TITLE, CADENCE_TITLE]
      state: $state
    ) {
      nodes {
        ...IterationFragment
      }
    }
  }
}
${iterationFragment}
`;

// apps/gitlab-plus/src/providers/IterationsProvider.ts
class IterationsProvider extends GitlabProvider {
  async getIterations(projectId, title = '') {
    return this.queryCached(
      `iterations-${projectId}-search-${title}`,
      iterationQuery,
      {
        fullPath: projectId,
        state: 'opened',
        title,
      },
      title !== '' ? 0.5 : 20
    );
  }
}

// apps/gitlab-plus/src/components/create-issue/fields/IterationField.tsx
function iterationName(iteration) {
  const start = new Date(iteration.startDate).toLocaleDateString();
  const end = new Date(iteration.dueDate).toLocaleDateString();
  return `${iteration.iterationCadence.title}: ${start} - ${end}`;
}

function IterationField({ link, setValue, value }) {
  const getUsers = useCallback(
    async (search) => {
      const response = await new IterationsProvider().getIterations(
        link.workspacePath,
        search
      );
      return response.data.workspace.attributes.nodes
        .map((iteration) => ({
          ...iteration,
          name: iterationName(iteration),
        }))
        .toSorted((a, b) => a.name.localeCompare(b.name));
    },
    [link]
  );
  const renderLabel = useCallback(([item]) => {
    return item ? item.name : 'Select iteration';
  }, []);
  const renderOption = useCallback((item) => {
    return jsx('span', {
      class: 'gl-new-dropdown-item-text-wrapper',
      children: jsx('span', {
        class: 'gl-flex gl-w-full gl-items-center',
        children: jsx('span', {
          class: 'gl-mr-2 gl-block',
          children: item.name,
        }),
      }),
    });
  }, []);
  return jsx(AsyncAutocomplete, {
    getValues: getUsers,
    name: 'iterations',
    onChange: setValue,
    renderLabel,
    renderOption,
    value,
  });
}

// apps/gitlab-plus/src/providers/query/label.ts
const labelFragment = `
  fragment LabelFragment on Label {
    id
    title
    description
    color
    textColor
  }
`;
const projectLabelsQuery = `query projectLabels($fullPath: ID!, $searchTerm: String) {
  workspace: project(fullPath: $fullPath) {
    id
    labels(
      searchTerm: $searchTerm
      includeAncestorGroups: true
    ) {
      nodes {
        ...LabelFragment
      }
    }
  }
}
${labelFragment}
`;
const workspaceLabelsQuery = `query groupLabels($fullPath: ID!, $searchTerm: String) {
  workspace: group(fullPath: $fullPath) {
    id
    labels(
      searchTerm: $searchTerm
      onlyGroupLabels: true
      includeAncestorGroups: true
    ) {
      nodes {
        ...LabelFragment
      }
    }
  }
}

${labelFragment}
`;

// apps/gitlab-plus/src/providers/LabelsProvider.ts
class LabelsProvider extends GitlabProvider {
  async getProjectLabels(projectPath, search = '') {
    return this.queryCached(
      `project-${projectPath}-labels-${search}`,
      projectLabelsQuery,
      {
        fullPath: projectPath,
        searchTerm: search,
      },
      search === '' ? 20 : 2
    );
  }

  async getWorkspaceLabels(workspacePath, search = '') {
    return this.queryCached(
      `workspace-${workspacePath}-labels-${search}`,
      workspaceLabelsQuery,
      {
        fullPath: workspacePath,
        searchTerm: search,
      },
      search === '' ? 20 : 2
    );
  }
}

// apps/gitlab-plus/src/components/common/GitlabLabel.tsx
function GitlabLabel({ label, onRemove }) {
  const [scope, text] = label.title.split('::');
  const props = useMemo(() => {
    const className = [
      'gl-label',
      'hide-collapsed',
      label.textColor === '#FFFFFF'
        ? 'gl-label-text-light'
        : 'gl-label-text-dark',
    ];
    if (label.title.includes('::')) {
      className.push('gl-label-scoped');
    }
    return {
      class: clsx(className),
      style: {
        '--label-background-color': label.color,
        '--label-inset-border': `inset 0 0 0 2px ${label.color}`,
      },
    };
  }, [label]);
  return jsxs('span', {
    class: props.class,
    style: props.style,
    children: [
      jsxs('span', {
        class: 'gl-link gl-label-link gl-label-link-underline',
        children: [
          jsx('span', { class: 'gl-label-text', children: scope }),
          text &&
            jsx('span', { class: 'gl-label-text-scoped', children: text }),
        ],
      }),
      onRemove &&
        jsx('button', {
          onClick: onRemove,
          type: 'button',
          class:
            'btn gl-label-close !gl-p-0 btn-reset btn-sm gl-button btn-reset-tertiary',
          children: jsx('span', {
            class: 'gl-button-text',
            children: jsx(GitlabIcon, { icon: 'close-xs' }),
          }),
        }),
    ],
  });
}

// apps/gitlab-plus/src/components/create-issue/fields/LabelsField.tsx
function LabelField({ copyLabels, projectPath, setValue, value }) {
  const getLabels = useCallback(
    async (search) => {
      if (!projectPath) {
        return [];
      }
      const response = await new LabelsProvider().getProjectLabels(
        projectPath,
        search
      );
      return response.data.workspace.labels.nodes;
    },
    [projectPath]
  );
  const renderLabel = useCallback((items) => {
    return items.length
      ? items.map((i) => i.title).join(', ')
      : 'Select labels';
  }, []);
  const renderOption = useCallback((item) => {
    return jsxs('div', {
      class: 'gl-flex gl-flex-1 gl-break-anywhere gl-pb-3 gl-pl-4 gl-pt-3',
      children: [
        jsx('span', {
          class: 'dropdown-label-box gl-top-0 gl-mr-3 gl-shrink-0',
          style: { backgroundColor: item.color },
        }),
        jsx('span', { children: item.title }),
      ],
    });
  }, []);
  return jsxs(Fragment, {
    children: [
      jsx('div', {
        class: 'gl-mt-1 gl-pb-2 gl-flex gl-flex-wrap gl-gap-2',
        children: value.map((label) =>
          jsx(
            GitlabLabel,
            {
              label,
              onRemove: () =>
                setValue(value.filter((item) => label.id !== item.id)),
            },
            label.id
          )
        ),
      }),
      jsxs('div', {
        className: 'gl-flex gl-gap-1 gl-relative gl-pr-7',
        children: [
          jsx(AsyncAutocomplete, {
            getValues: getLabels,
            isDisabled: !projectPath,
            name: 'labels',
            onChange: setValue,
            renderLabel,
            renderOption,
            value,
            isMultiselect: true,
          }),
          jsx('div', {
            className: 'gl-flex gl-absolute gl-h-full gl-right-0',
            children: jsx(GitlabButton, {
              icon: 'labels',
              onClick: copyLabels,
              title: 'Copy labels from parent',
            }),
          }),
        ],
      }),
    ],
  });
}

// apps/gitlab-plus/src/providers/query/milestone.ts
const milestoneFragment = `
fragment MilestoneFragment on Milestone {
  id
  iid
  title
  webUrl: webPath
  dueDate
  expired
  state
}

`;
const milestoneQuery = `query projectMilestones($fullPath: ID!, $title: String, $state: MilestoneStateEnum) {
  workspace: project(fullPath: $fullPath) {
    id
    attributes: milestones(
      searchTitle: $title
      state: $state
      sort: EXPIRED_LAST_DUE_DATE_ASC
      first: 40
      includeAncestors: true
    ) {
      nodes {
        ...MilestoneFragment
      }
    }
  }
}

${milestoneFragment}
`;

// apps/gitlab-plus/src/providers/MilestonesProvider.ts
class MilestonesProvider extends GitlabProvider {
  async getMilestones(projectId, title = '') {
    return this.queryCached(
      `milestones-${projectId}-${title}`,
      milestoneQuery,
      {
        fullPath: projectId,
        state: 'active',
        title,
      },
      title === '' ? 20 : 0.5
    );
  }
}

// apps/gitlab-plus/src/components/create-issue/fields/MilestoneField.tsx
function MilestoneField({ projectPath, setValue, value }) {
  const getMilestones = useCallback(
    async (search) => {
      if (!projectPath) {
        return [];
      }
      const response = await new MilestonesProvider().getMilestones(
        projectPath,
        search
      );
      return response.data.workspace.attributes.nodes;
    },
    [projectPath]
  );
  const renderLabel = useCallback(([item]) => {
    return item ? item.title : 'Select milestone';
  }, []);
  const renderOption = useCallback((item) => {
    return jsx('span', {
      class: 'gl-new-dropdown-item-text-wrapper',
      children: jsx('span', {
        class: 'gl-flex gl-w-full gl-items-center',
        children: jsx('span', {
          class: 'gl-mr-2 gl-block',
          children: item.title,
        }),
      }),
    });
  }, []);
  return jsx(AsyncAutocomplete, {
    getValues: getMilestones,
    isDisabled: !projectPath,
    name: 'milestones',
    onChange: setValue,
    renderLabel,
    renderOption,
    value,
  });
}

// apps/gitlab-plus/src/providers/query/project.ts
const projectsQuery = `query boardsGetGroupProjects($fullPath: ID!, $search: String, $after: String) {
  workspace: group(fullPath: $fullPath) {
    id
    projects(search: $search, after: $after, first: 100, includeSubgroups: true) {
      nodes {
        id
        name
        avatarUrl
        fullPath
        nameWithNamespace
        archived
      }
    }
  }
}
`;

// apps/gitlab-plus/src/providers/ProjectsProvider.ts
class ProjectsProvider extends GitlabProvider {
  async getProjects(workspacePath, search = '') {
    return this.queryCached(
      `projects-${workspacePath}-${search}`,
      projectsQuery,
      {
        fullPath: workspacePath,
        search,
      },
      search === '' ? 20 : 0.5
    );
  }
}

// apps/gitlab-plus/src/components/common/GitlabProject.tsx
function GitlabProject({ project, size = 32 }) {
  return jsxs('span', {
    class: 'gl-flex gl-w-full gl-items-center',
    children: [
      project.avatarUrl
        ? jsx('img', {
            alt: project.name,
            class: `gl-mr-3 gl-avatar gl-avatar-s${size}`,
            src: project.avatarUrl,
          })
        : jsx('div', {
            class: `gl-mr-3 gl-avatar gl-avatar-identicon gl-avatar-s${size} gl-avatar-identicon-bg1`,
            children: project.name[0].toUpperCase(),
          }),
      jsxs('span', {
        children: [
          jsx('span', { class: 'gl-mr-2 gl-block', children: project.name }),
          jsx('span', {
            class: 'gl-block gl-text-secondary !gl-text-sm',
            children: project.nameWithNamespace,
          }),
        ],
      }),
    ],
  });
}

// apps/gitlab-plus/src/components/create-issue/fields/ProjectField.tsx
function ProjectField({ link, setValue, value }) {
  const getProjects = useCallback(
    async (search) => {
      const response = await new ProjectsProvider().getProjects(
        link.workspacePath,
        search
      );
      return response.data.workspace.projects.nodes;
    },
    [link]
  );
  const renderLabel = useCallback(([item]) => {
    return item ? item.nameWithNamespace : 'Select project';
  }, []);
  const renderOption = useCallback((item) => {
    return jsx('span', {
      class: 'gl-new-dropdown-item-text-wrapper',
      children: jsx(GitlabProject, { project: item }),
    });
  }, []);
  return jsx(AsyncAutocomplete, {
    getValues: getProjects,
    name: 'projects',
    onChange: setValue,
    renderLabel,
    renderOption,
    value,
  });
}

// apps/gitlab-plus/src/types/Issue.ts
const issueRelation = ['blocks', 'is_blocked_by', 'relates_to'];

// apps/gitlab-plus/src/components/create-issue/fields/RelationField.tsx
const labels = (relation) => {
  switch (relation) {
    case 'blocks':
      return 'blocks current issue';
    case 'is_blocked_by':
      return 'is blocked by current issue';
    case 'relates_to':
      return 'relates to current issue';
    default:
      return 'is not related to current issue';
  }
};

function RelationField({ setValue, value }) {
  return jsx('div', {
    class: 'linked-issue-type-radio',
    children: [...issueRelation, null].map((relation) =>
      jsxs(
        'div',
        {
          class: 'gl-form-radio custom-control custom-radio',
          children: [
            jsx('input', {
              id: `create-related-issue-relation-${relation}`,
              checked: value === relation,
              class: 'custom-control-input',
              name: 'linked-issue-type-radio',
              onChange: () => setValue(relation),
              type: 'radio',
              value: relation ?? '',
            }),
            jsx('label', {
              class: 'custom-control-label',
              for: `create-related-issue-relation-${relation}`,
              children: labels(relation),
            }),
          ],
        },
        relation
      )
    ),
  });
}

// apps/gitlab-plus/src/components/create-issue/fields/TitleField.tsx
function TitleField({ error, onChange, value }) {
  return jsx('input', {
    onInput: (e) => onChange(e.target.value),
    placeholder: 'Add a title',
    value,
    class: clsx(
      'gl-form-input form-control',
      error && 'gl-field-error-outline'
    ),
  });
}

// apps/gitlab-plus/src/types/Epic.ts
var WidgetType = ((WidgetType2) => {
  WidgetType2['hierarchy'] = 'HIERARCHY';
  WidgetType2['label'] = 'LABELS';
  return WidgetType2;
})(WidgetType || {});

// apps/gitlab-plus/src/helpers/WidgetHelper.ts
class WidgetHelper {
  static getWidget(widgets, type) {
    return widgets == null
      ? void 0
      : widgets.find((widget) => widget.type === type);
  }
}

// apps/gitlab-plus/src/helpers/LabelHelper.ts
class LabelHelper {
  static getLabelsFromWidgets(widgets) {
    let _a;
    return (
      ((_a = LabelHelper.getLabelWidget(widgets)) == null
        ? void 0
        : _a.labels.nodes) || []
    );
  }

  static getLabelWidget(widgets) {
    return WidgetHelper.getWidget(widgets, WidgetType.label);
  }

  static getStatusLabel(labels2) {
    return labels2 == null
      ? void 0
      : labels2.find((label) =>
          label.title.startsWith(LabelHelper.getStatusPrefix())
        );
  }

  static getStatusLabelFromWidgets(widgets) {
    return LabelHelper.getStatusLabel(
      LabelHelper.getLabelsFromWidgets(widgets)
    );
  }

  static getStatusPrefix() {
    return userSettingsStore.getConfig(UserConfig.StatusLabelPrefix);
  }
}

// apps/gitlab-plus/src/helpers/LinkParser.ts
class LinkParser {
  static epicPattern(strict = false) {
    return LinkParser.patternGroup('epic', 'epics', strict);
  }

  static isEpicLink(link) {
    return link.epic !== void 0;
  }

  static isIssueLink(link) {
    return link.issue !== void 0;
  }

  static isMrLink(link) {
    return link.mr !== void 0;
  }

  static issuePattern(strict = false) {
    return LinkParser.patternProject('issue', 'issues', strict);
  }

  static mrPattern(strict = false) {
    return LinkParser.patternProject('mr', 'merge_requests', strict);
  }

  static parseEpicLink(link, strict = false) {
    if (LinkParser.validateEpicLink(link, strict)) {
      return LinkParser.parseGitlabLink(link, LinkParser.epicPattern(strict));
    }
    return void 0;
  }

  static parseGitlabLink(link, pattern) {
    const result = new URL(link).pathname.match(pattern);
    if (result && result.groups) {
      return result.groups;
    }
    return void 0;
  }

  static parseIssueLink(link, strict = false) {
    if (LinkParser.validateIssueLink(link)) {
      return LinkParser.parseGitlabLink(link, LinkParser.issuePattern(strict));
    }
    return void 0;
  }

  static parseMrLink(link, strict = false) {
    if (LinkParser.validateMrLink(link)) {
      return LinkParser.parseGitlabLink(link, LinkParser.mrPattern(strict));
    }
    return void 0;
  }

  static patternGroup(name2, entity, strict) {
    const end = !strict ? '([?#]{1}.*)?' : '';
    return new RegExp(
      `\\/groups\\/(?<workspacePath>.+)\\/-\\/${entity}\\/(?<${name2}>\\d+)\\/?${end}$`
    );
  }

  static patternProject(name2, entity, strict) {
    const end = !strict ? '([?#]{1}.*)?' : '';
    return new RegExp(
      `\\/(?<projectPath>(?<workspacePath>.+)\\/[^/]+)\\/-\\/${entity}\\/(?<${name2}>\\d+)\\/?${end}$`
    );
  }

  static validateEpicLink(link, strict = false) {
    return LinkParser.validateGitlabLink(link, LinkParser.epicPattern(strict));
  }

  static validateGitlabLink(link, pattern) {
    return Boolean(typeof link === 'string' && pattern.test(link));
  }

  static validateIssueLink(link, strict = false) {
    return LinkParser.validateGitlabLink(link, LinkParser.issuePattern(strict));
  }

  static validateMrLink(link, strict = false) {
    return LinkParser.validateGitlabLink(link, LinkParser.mrPattern(strict));
  }
}

// apps/gitlab-plus/src/providers/query/widget.ts
const labelsWidgetFragment = `
fragment LabelsWidgetFragment on WorkItemWidgetLabels {
  labels {
    nodes {
      ...LabelFragment
    }
  }
}
`;
const hierarchyWidgetFragment = `
fragment HierarchyWidgetFragment on WorkItemWidgetHierarchy {
    hasChildren
    children(first: 100) {
      count
      nodes {
        id
        iid
        title
        state
        webUrl
        widgets {
          type
          ...LabelsWidgetFragment
        }
      }
    }
  }
`;

// apps/gitlab-plus/src/providers/query/epic.ts
const epicQuery = `query namespaceWorkItem($fullPath: ID!, $iid: String!) {
  workspace: namespace(fullPath: $fullPath) {
    id
    workItem(iid: $iid) {
      ...WorkItem
    }
  }
}

fragment WorkItem on WorkItem {
  id
  iid
  archived
  title
  state
  description
  createdAt
  closedAt
  webUrl
  project {
    id
  }
  namespace {
    id
    fullPath
    name
    fullName
  }
  author {
    ...UserFragment
  }
  widgets {
    type
  ...LabelsWidgetFragment
  ...HierarchyWidgetFragment
  }
}

${labelsWidgetFragment}
${hierarchyWidgetFragment}
${labelFragment}
${userFragment}
`;
const epicSetLabelsMutation = `
mutation workItemUpdate($input: WorkItemUpdateInput!) {
  workItemUpdate(input: $input) {
    errors
  }
}
`;

// apps/gitlab-plus/src/providers/EpicProvider.ts
class EpicProvider extends GitlabProvider {
  async getEpic(workspacePath, epicId) {
    return this.queryCached(
      `epic-${workspacePath}-${epicId}`,
      epicQuery,
      {
        iid: epicId,
        cursor: '',
        fullPath: workspacePath,
        pageSize: 50,
      },
      2
    );
  }

  async updateEpicLabels(id, addLabelIds, removeLabelIds) {
    return await this.query(epicSetLabelsMutation, {
      input: {
        id,
        labelsWidget: {
          addLabelIds,
          removeLabelIds,
        },
      },
    });
  }
}

// apps/gitlab-plus/src/providers/query/issue.ts
const issueQuery = `query issueEE($projectPath: ID!, $iid: String!) {
  project(fullPath: $projectPath) {
    id
    issue(iid: $iid) {
      id
      iid
      title
      description
      createdAt
      state
      dueDate
      projectId
      webUrl
      weight
      type
      milestone {
        id
        title
        startDate
        dueDate
      }
      epic {
        id
        iid
        title
        webUrl
        labels {
          nodes {
            ...LabelFragment
          }
        }
      }
      iteration {
        ...IterationFragment
      }
      labels {
        nodes {
          ...LabelFragment
        }
      }
      relatedMergeRequests {
        nodes {
          iid
          title
          state
          webUrl
          author {
            ...UserFragment
          }
        }
      }
      assignees {
        nodes {
          ...UserFragment
        }
      }
      author {
        ...UserFragment
      }
      linkedWorkItems {
        nodes {
          linkType
          workItemState
          workItem {
            id
            iid
            webUrl
            title
            widgets {
              type
              ...LabelsWidgetFragment
            }
          }
        }
      }
    }
  }
}

${labelFragment}
${labelsWidgetFragment}
${userFragment}
${iterationFragment}
`;
const issueWithRelatedIssuesLabelsQuery = `query issueEE($projectPath: ID!, $iid: String!) {
  project(fullPath: $projectPath) {
    issue(iid: $iid) {
      linkedWorkItems {
        nodes {
          workItem {
            id
            iid
            widgets {
              type
              ...LabelsWidgetFragment
            }
          }
        }
      }
    }
  }
}

${labelsWidgetFragment}
${labelFragment}
`;
const issuesQuery = `query groupWorkItems($searchTerm: String, $fullPath: ID!, $types: [IssueType!], $in: [IssuableSearchableField!], $includeAncestors: Boolean = false, $includeDescendants: Boolean = false, $iid: String = null, $searchByIid: Boolean = false, $searchByText: Boolean = true, $searchEmpty: Boolean = true) {
  workspace: group(fullPath: $fullPath) {
    id
    workItems(
      search: $searchTerm
      types: $types
      in: $in
      includeAncestors: $includeAncestors
      includeDescendants: $includeDescendants
    ) @include(if: $searchByText) {
      nodes {
        ...WorkItemSearchFragment
      }
    }
    workItemsByIid: workItems(
      iid: $iid
      types: $types
      includeAncestors: $includeAncestors
      includeDescendants: $includeDescendants
    ) @include(if: $searchByIid) {
      nodes {
        ...WorkItemSearchFragment
      }
    }
    workItemsEmpty: workItems(
      types: $types
      includeAncestors: $includeAncestors
      includeDescendants: $includeDescendants
    ) @include(if: $searchEmpty) {
      nodes {
        ...WorkItemSearchFragment
      }
    }
  }
}

fragment WorkItemSearchFragment on WorkItem {
  id
  iid
  title
  project {
    fullPath
  }
}
`;
const issueMutation = `
mutation CreateIssue($input: CreateIssueInput!) {
  createIssue(input: $input) {
    issue {
      ...CreatedIssue
    }
    errors
  }
}

fragment CreatedIssue on Issue {
  id
  iid
  projectId
}
`;
const issueSetEpicMutation = `
mutation projectIssueUpdateParent($input: WorkItemUpdateInput!) {
  workItemUpdate(input: $input) {
    errors
  }
}
`;
const issueSetLabelsMutation = `
mutation issueSetLabels($input: UpdateIssueInput!) {
  updateIssue(input: $input) {
    errors
  }
}
`;
const issueSetAssigneesMutation = `
mutation issueSetAssignees($input: IssueSetAssigneesInput!) {
  issueSetAssignees(input: $input) {
    errors
  }
}
`;

// apps/gitlab-plus/src/providers/IssueProvider.ts
class IssueProvider extends GitlabProvider {
  async createIssue(input) {
    return await this.query(issueMutation, { input });
  }

  async createIssueRelation(input) {
    const path = [
      'projects/:PROJECT_ID',
      '/issues/:ISSUE_ID/links',
      '?target_project_id=:TARGET_PROJECT_ID',
      '&target_issue_iid=:TARGET_ISSUE_IID',
      '&link_type=:LINK_TYPE',
    ]
      .join('')
      .replace(':PROJECT_ID', `${input.projectId}`)
      .replace(':ISSUE_ID', `${input.issueId}`)
      .replace(':TARGET_PROJECT_ID', input.targetProjectId)
      .replace(':TARGET_ISSUE_IID', input.targetIssueIid)
      .replace(':LINK_TYPE', input.linkType);
    return await this.post(path, {});
  }

  async getIssue(projectPath, iid) {
    return this.queryCached(
      `issue-${projectPath}-${iid}`,
      issueQuery,
      {
        iid,
        projectPath,
      },
      2
    );
  }

  async getIssues(projectPath, search) {
    const searchById = !!search.match(/^\d+$/);
    return await this.query(issuesQuery, {
      iid: searchById ? search : null,
      searchByIid: searchById,
      fullPath: projectPath,
      in: 'TITLE',
      includeAncestors: true,
      includeDescendants: true,
      searchByText: Boolean(search),
      searchEmpty: !search,
      searchTerm: search,
      types: ['ISSUE'],
    });
  }

  async getIssueWithRelatedIssuesLabels(projectPath, iid) {
    return this.queryCached(
      `issue-related-issues-${projectPath}-${iid}`,
      issueWithRelatedIssuesLabelsQuery,
      {
        iid,
        projectPath,
      },
      2
    );
  }

  async issueSetAssignees(input) {
    return await this.query(issueSetAssigneesMutation, { input });
  }

  async issueSetEpic(issueId, epicId) {
    return await this.query(issueSetEpicMutation, {
      input: {
        hierarchyWidget: {
          parentId: epicId,
        },
        id: issueId,
      },
    });
  }

  async issueSetLabels(input) {
    return await this.query(issueSetLabelsMutation, { input });
  }
}

// apps/gitlab-plus/src/components/create-issue/useCreateIssueForm.ts
const initialState = () => ({
  assignees: [],
  iteration: null,
  labels: [],
  milestone: null,
  project: null,
  relation: null,
  title: '',
});
const initialError = () => ({
  assignees: void 0,
  iteration: void 0,
  labels: void 0,
  milestone: void 0,
  project: void 0,
  relation: void 0,
  title: void 0,
});

function useCreateIssueForm({ isVisible, link, onClose }) {
  let _a;
  const [values, setValues] = useState(initialState());
  const [errors, setErrors] = useState(initialError());
  const [parentIssue, setParentIssue] = useState(null);
  const [parentEpic, setParentEpic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const reset = (resetParent = false) => {
    setIsLoading(false);
    setValues(initialState());
    setErrors(initialError());
    setMessage('');
    setError('');
    if (resetParent) {
      setParentIssue(null);
      setParentEpic(null);
    }
  };
  const createPayload = () => {
    const data = {
      projectPath: values.project.fullPath,
      title: values.title,
    };
    if (values.milestone) {
      data['milestoneId'] = values.milestone.id;
    }
    if (values.iteration) {
      data['iterationId'] = values.iteration.id;
      data['iterationCadenceId'] = values.iteration.iterationCadence.id;
    }
    if (values.assignees) {
      data['assigneeIds'] = values.assignees.map((a) => a.id);
    }
    data['labelIds'] = values.labels.map((label) => label.id);
    return data;
  };
  const persistRecently = () => {
    Object.entries({
      assignees: values.assignees,
      iterations: values.iteration ? [values.iteration] : [],
      labels: values.labels,
      milestones: values.milestone ? [values.milestone] : [],
      projects: values.project ? [values.project] : [],
    }).map(([key, values2]) => {
      new RecentlyProvider(key).add(...values2);
    });
  };
  const validate = () => {
    let isValid = true;
    const errors2 = {};
    if (values.title.length < 1) {
      errors2.title = 'Title is required';
      isValid = false;
    } else if (values.title.length > 255) {
      errors2.title = 'Title is too long';
      isValid = false;
    }
    if (!values.project) {
      errors2.project = 'Project must be selected';
      isValid = false;
    }
    setErrors((prev) => ({ ...prev, ...errors2 }));
    return isValid;
  };
  const createIssue = async (payload) => {
    return await new IssueProvider().createIssue(payload);
  };
  const createRelation = async (issue, targetIssue, relation) => {
    await new IssueProvider().createIssueRelation({
      targetIssueIid: targetIssue.iid,
      issueId: issue.iid,
      linkType: relation,
      projectId: issue.projectId,
      targetProjectId: targetIssue.projectId,
    });
  };
  const setIssueEpic = async (issue, epic) => {
    await new IssueProvider().issueSetEpic(issue.id, epic.id);
  };
  const submit = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    try {
      setMessage('Creating issue...');
      const payload = createPayload();
      const response = await createIssue(payload);
      persistRecently();
      if (values.relation && parentIssue) {
        setMessage('Creating relation to parent issue...');
        await createRelation(
          response.data.createIssue.issue,
          parentIssue,
          values.relation
        );
      }
      if (parentEpic) {
        setMessage('Linking to epic...');
        await setIssueEpic(response.data.createIssue.issue, parentEpic);
      }
      setMessage('Issue was created');
      window.setTimeout(() => onClose(), 2e3);
    } catch (e) {
      setMessage('');
      setError(e.message);
    }
    setIsLoading(false);
  };
  const fetchParent = async () => {
    if (LinkParser.isIssueLink(link)) {
      const issue = await new IssueProvider().getIssue(
        link.projectPath,
        link.issue
      );
      setParentIssue(issue.data.project.issue);
    }
    if (LinkParser.isEpicLink(link)) {
      const epic = await new EpicProvider().getEpic(
        link.workspacePath,
        link.epic
      );
      setParentEpic(epic.data.workspace.workItem);
    }
  };
  const getParentTitle = () => {
    return (
      (parentIssue == null ? void 0 : parentIssue.title) ||
      (parentEpic == null ? void 0 : parentEpic.title) ||
      ''
    );
  };
  const getParentLabels = () => {
    if (parentEpic) {
      return LabelHelper.getLabelsFromWidgets(parentEpic.widgets);
    }
    if (parentIssue) {
      return parentIssue.labels.nodes;
    }
    return [];
  };
  const fillForm = () => {
    const assignees = new RecentlyProvider('assignees').get();
    const iterations = new RecentlyProvider('iterations').get();
    const milestones = new RecentlyProvider('milestones').get();
    const projects = new RecentlyProvider('projects').get();
    setValues({
      ...values,
      assignees: assignees.length ? [assignees[0]] : values.assignees,
      iteration: iterations.length ? iterations[0] : values.iteration,
      labels: getParentLabels(),
      milestone: milestones.length ? milestones[0] : values.milestone,
      project: projects.length ? projects[0] : values.project,
      title: getParentTitle(),
    });
  };
  useEffect(() => {
    if (isVisible) {
      fetchParent();
    } else {
      reset(true);
    }
  }, [isVisible]);
  return {
    actions: {
      fillForm,
      onSubmit: (e) => {
        e.preventDefault();
        submit();
      },
      reset: () => reset(false),
      submit,
    },
    error,
    form: {
      assignees: {
        errors: errors.assignees,
        onChange: (assignees) => setValues({ ...values, assignees }),
        value: values.assignees,
      },
      iteration: {
        errors: errors.iteration,
        onChange: ([iteration]) =>
          setValues({ ...values, iteration: iteration ?? null }),
        value: values.iteration ? [values.iteration] : [],
      },
      labels: {
        copy: () => setValues({ ...values, labels: getParentLabels() }),
        errors: errors.labels,
        onChange: (labels2) => setValues({ ...values, labels: labels2 }),
        value: values.labels,
      },
      milestone: {
        errors: errors.milestone,
        onChange: ([milestone]) =>
          setValues({ ...values, milestone: milestone ?? null }),
        value: values.milestone ? [values.milestone] : [],
      },
      project: {
        errors: errors.project,
        onChange: ([project]) =>
          setValues({ ...values, project: project ?? null }),
        value: values.project ? [values.project] : [],
      },
      relation: {
        errors: errors.relation,
        onChange: (relation) => setValues({ ...values, relation }),
        value: values.relation,
      },
      title: {
        copy: () => setValues({ ...values, title: getParentTitle() }),
        errors: errors.title,
        onChange: (title) => setValues({ ...values, title }),
        value: values.title,
      },
    },
    isLoading,
    message,
    parentEpic,
    parentIssue,
    projectPath: (_a = values.project) == null ? void 0 : _a.fullPath,
  };
}

// apps/gitlab-plus/src/components/create-issue/CreateIssueForm.tsx
function CreateIssueForm({ isVisible, link, onClose }) {
  const {
    actions,
    error,
    form,
    isLoading,
    message,
    parentEpic,
    parentIssue,
    projectPath,
  } = useCreateIssueForm({ isVisible, link, onClose });
  return jsxs('form', {
    class: 'crud-body add-tree-form gl-mx-5 gl-my-4 gl-rounded-b-form',
    onSubmit: actions.onSubmit,
    children: [
      jsx(FormField, {
        error: form.title.errors,
        hint: 'Maximum of 255 characters',
        title: 'Title',
        children: jsxs('div', {
          className: 'gl-flex gl-gap-1',
          children: [
            jsx(TitleField, {
              error: form.title.errors,
              onChange: form.title.onChange,
              value: form.title.value,
            }),
            jsx(GitlabButton, {
              icon: 'title',
              onClick: form.title.copy,
              title: 'Copy from parent title',
            }),
            jsx(GitlabButton, {
              icon: 'insert',
              onClick: actions.fillForm,
              title: 'Fill form with parent and last used data',
            }),
          ],
        }),
      }),
      jsxs(FormRow, {
        children: [
          jsx(FormField, {
            error: form.project.errors,
            title: 'Project',
            children: jsx(ProjectField, {
              link,
              setValue: form.project.onChange,
              value: form.project.value,
            }),
          }),
          jsx(FormField, {
            error: form.assignees.errors,
            title: 'Assignees',
            children: jsx(AssigneesField, {
              projectPath,
              setValue: form.assignees.onChange,
              value: form.assignees.value,
            }),
          }),
        ],
      }),
      jsxs(FormRow, {
        children: [
          jsx(FormField, {
            error: form.iteration.errors,
            title: 'Iteration',
            children: jsx(IterationField, {
              link,
              setValue: form.iteration.onChange,
              value: form.iteration.value,
            }),
          }),
          jsx(FormField, {
            error: form.milestone.errors,
            title: 'Milestone',
            children: jsx(MilestoneField, {
              projectPath,
              setValue: form.milestone.onChange,
              value: form.milestone.value,
            }),
          }),
        ],
      }),
      jsx(FormField, {
        error: form.labels.errors,
        title: 'Labels',
        children: jsx(LabelField, {
          copyLabels: form.labels.copy,
          projectPath,
          setValue: form.labels.onChange,
          value: form.labels.value,
        }),
      }),
      parentIssue &&
        jsxs(FormField, {
          error: form.relation.errors,
          title: 'New issue',
          children: [
            jsx(RelationField, {
              setValue: form.relation.onChange,
              value: form.relation.value,
            }),
            jsxs(Text, {
              size: 'sm',
              variant: 'secondary',
              children: [
                'Parent issue: #',
                parentIssue.iid,
                ' ',
                parentIssue.title,
              ],
            }),
          ],
        }),
      parentEpic &&
        jsx(FormField, {
          title: '',
          children: jsxs(Text, {
            size: 'sm',
            variant: 'secondary',
            children: ['Parent epic: &', parentEpic.iid, ' ', parentEpic.title],
          }),
        }),
      jsx(FormField, {
        error,
        hint: message,
        title: '',
        children: jsx(FormRow, {
          children: jsx(ButtonField, {
            create: actions.submit,
            isLoading,
            reset: actions.reset,
          }),
        }),
      }),
    ],
  });
}

// apps/gitlab-plus/src/components/create-issue/CreateChildIssueModal.tsx
function CreateChildIssueModal({ link }) {
  const { isVisible, onClose } = useGlpModal(ModalEvents.showChildIssueModal);
  return jsx(GlpModal, {
    isVisible,
    onClose,
    title: 'Create child issue',
    children: jsx(CreateIssueForm, { isVisible, link, onClose }),
  });
}

// apps/gitlab-plus/src/components/create-issue/CreateIssueButton.tsx
function CreateIssueButton({ eventName, label }) {
  const onClick = () => document.dispatchEvent(new CustomEvent(eventName));
  return jsx(GitlabButton, { onClick, children: label });
}

// apps/gitlab-plus/src/helpers/GitlabHtmlElements.ts
class GitlabHtmlElements {
  static crudActionElement(...ids) {
    const selector = ids
      .map((s) => `${s} [data-testid="crud-actions"]`)
      .join(', ');
    return document.querySelector(selector);
  }
}

// apps/gitlab-plus/src/helpers/RendererHelper.ts
class RendererHelper {
  static mountPoint(mountPoint) {
    return mountPoint instanceof HTMLElement
      ? mountPoint
      : document.querySelector(mountPoint);
  }

  static pageLink(linkParser) {
    return linkParser(window.location.href);
  }

  static render(id, mountPoint, renderer, mode = 'append') {
    const node = RendererHelper.mountPoint(mountPoint);
    if (!node) {
      return false;
    }
    return RendererHelper.renderInNode(
      RendererHelper.root(id, node, mode),
      renderer
    );
  }

  static renderInBody(id, renderer) {
    return RendererHelper.renderInNode(
      RendererHelper.root(id, document.body),
      renderer
    );
  }

  static renderInNode(node, renderer) {
    render(renderer instanceof Function ? renderer() : renderer, node);
    return true;
  }

  static renderWithLink(id, mountPoint, linkParser, renderer, mode = 'append') {
    const link = RendererHelper.pageLink(linkParser);
    if (!link) {
      return false;
    }
    return RendererHelper.render(id, mountPoint, () => renderer(link), mode);
  }

  static root(className, node, mode = 'append') {
    const root = document.createElement('div');
    root.className = className;
    if (node) {
      node[mode](root);
    }
    return root;
  }
}

// apps/gitlab-plus/src/services/CreateChildIssue.tsx
class CreateChildIssue extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.CreateChildIssue);
  }

  init() {
    this.setup(this.mount.bind(this), LinkParser.validateEpicLink);
  }

  mount() {
    const link = RendererHelper.pageLink(LinkParser.parseEpicLink);
    const parent = GitlabHtmlElements.crudActionElement('#childitems');
    if (!link || !parent) {
      return;
    }
    this.ready = true;
    RendererHelper.render(
      'glp-child-issue-button',
      parent,
      jsx(CreateIssueButton, {
        eventName: ModalEvents.showChildIssueModal,
        label: 'Create child issue',
      }),
      'prepend'
    );
    RendererHelper.renderInBody(
      'glp-child-issue-modal',
      jsx(CreateChildIssueModal, { link })
    );
  }
}

// apps/gitlab-plus/src/components/create-issue/CreateRelatedIssueModal.tsx
function CreateRelatedIssueModal({ link }) {
  const { isVisible, onClose } = useGlpModal(ModalEvents.showRelatedIssueModal);
  return jsx(GlpModal, {
    isVisible,
    onClose,
    title: 'Create related issue',
    children: jsx(CreateIssueForm, { isVisible, link, onClose }),
  });
}

// apps/gitlab-plus/src/services/CreateRelatedIssue.tsx
class CreateRelatedIssue extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.CreateRelatedIssue);
  }

  init() {
    this.setup(this.mount.bind(this), LinkParser.validateIssueLink);
  }

  mount() {
    const link = LinkParser.parseIssueLink(window.location.href);
    const parent = GitlabHtmlElements.crudActionElement(
      '#related-issues',
      '#linkeditems'
    );
    if (!link || !parent) {
      return;
    }
    this.ready = true;
    RendererHelper.render(
      'glp-related-issue-button',
      parent,
      jsx(CreateIssueButton, {
        eventName: ModalEvents.showRelatedIssueModal,
        label: 'Create related issue',
      }),
      'prepend'
    );
    RendererHelper.renderInBody(
      'glp-related-issue-modal',
      jsx(CreateRelatedIssueModal, { link })
    );
  }
}

// libs/share/src/ui/Events.ts
class Events {
  static intendHover(validate, mouseover, mouseleave, timeout = 500) {
    let hover = false;
    let id = 0;
    const onHover = (event) => {
      if (!event.target || !validate(event.target)) {
        return;
      }
      const element = event.target;
      hover = true;
      element.addEventListener(
        'mouseleave',
        (ev) => {
          mouseleave == null ? void 0 : mouseleave.call(element, ev);
          clearTimeout(id);
          hover = false;
        },
        { once: true }
      );
      clearTimeout(id);
      id = window.setTimeout(() => {
        if (hover) {
          mouseover.call(element, event);
        }
      }, timeout);
    };
    document.body.addEventListener('mouseover', onHover);
  }
}

// apps/gitlab-plus/src/components/common/modal/useOnLinkHover.ts
const modalZIndex = 5e3;

function useOnLinkHover(parser, validator) {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverLink, setHoverLink] = useState();
  const [zIndex, setZIndex] = useState(modalZIndex);
  const hoverLinkRef = useRef(false);
  const onHover = (event) => {
    const anchor = event.target;
    const link = parser(anchor.href);
    if (!link) {
      return;
    }
    anchor.title = '';
    setHoverLink(link);
    setZIndex(
      anchor.dataset.zIndex ? Number(anchor.dataset.zIndex) : modalZIndex
    );
    setHoverPosition({
      x: event.clientX + 15,
      y: event.clientY,
    });
  };
  useEffect(() => {
    Events.intendHover(
      (element) => validator(element.href, true),
      onHover,
      () => {
        setTimeout(() => {
          if (!hoverLinkRef.current) {
            setHoverLink(void 0);
          }
        }, 50);
      }
    );
  }, []);
  return {
    hoverLink,
    hoverPosition,
    onLinkEnter: () => (hoverLinkRef.current = true),
    onLinkLeave: () => {
      hoverLinkRef.current = false;
      setHoverLink(void 0);
    },
    zIndex,
  };
}

// apps/gitlab-plus/src/components/common/modal/usePreviewModal.ts
function usePreviewModal(link, fetch2, reset, isLoading) {
  const [isVisible, setIsVisible] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        const rect = ref.current.getBoundingClientRect();
        const dY = rect.height + rect.top - window.innerHeight;
        const dX = rect.width + rect.left - window.innerWidth;
        setOffset({
          x: dX > 0 ? dX + 15 : 0,
          y: dY > 0 ? dY + 15 : 0,
        });
      }, 300);
    }
  }, [isLoading]);
  useEffect(() => {
    if (!isVisible) {
      setOffset({ x: 0, y: 0 });
    }
  }, [isVisible]);
  useEffect(() => {
    if (link) {
      fetch2(link);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      reset();
    }
  }, [link]);
  return {
    isVisible,
    offset,
    ref,
  };
}

// apps/gitlab-plus/src/components/common/modal/PreviewModal.tsx
function PreviewModal({
  validator,
  children,
  fetch: fetch2,
  isError,
  isLoading = false,
  isRefreshing = false,
  parser,
  reset,
}) {
  const { hoverLink, hoverPosition, onLinkEnter, onLinkLeave, zIndex } =
    useOnLinkHover(parser, validator);
  const { isVisible, offset, ref } = usePreviewModal(
    hoverLink,
    fetch2,
    reset,
    isLoading
  );
  const content = useMemo(() => {
    if (isLoading || !isVisible) {
      return jsx(GitlabLoader, { size: '3em', asOverlay: true });
    }
    if (isError) {
      return jsx(Row, {
        className: 'gl-flex-1',
        items: 'center',
        justify: 'center',
        children: 'Error',
      });
    }
    return jsxs('div', {
      className: 'gl-flex gl-w-full gl-flex-col',
      children: [
        children,
        isRefreshing && jsx(GitlabLoader, { size: '3em', asOverlay: true }),
      ],
    });
  }, [isLoading, isRefreshing, isError, isVisible, children]);
  return jsx('div', {
    onMouseEnter: onLinkEnter,
    onMouseLeave: onLinkLeave,
    ref,
    className: clsx(
      'popover gl-popover glp-preview-modal',
      isVisible && 'glp-modal-visible'
    ),
    style: {
      left: hoverPosition.x,
      top: hoverPosition.y,
      transform: `translate(-${offset.x}px, -${offset.y}px )`,
      zIndex,
    },
    children: content,
  });
}

// apps/gitlab-plus/src/components/common/base/Link.tsx
function Link({ blockHover, children, className, href, inline, title }) {
  const [zIndex, setZIndex] = useState(modalZIndex + 1);
  const ref = useRef(null);
  const onHover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  useLayoutEffect(() => {
    let _a;
    const modal =
      (_a = ref.current) == null ? void 0 : _a.closest('.glp-preview-modal');
    setZIndex(
      (modal == null ? void 0 : modal.style.zIndex)
        ? Number(modal.style.zIndex) + 1
        : modalZIndex + 1
    );
  }, []);
  return jsx('a', {
    'data-z-index': zIndex,
    href,
    onMouseOver: blockHover ? onHover : void 0,
    ref,
    target: '_blank',
    title,
    class: clsx(
      inline ? 'gl-inline' : 'gl-flex',
      'gl-link sortable-link gl-items-center',
      className
    ),
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    children,
  });
}

// apps/gitlab-plus/src/components/common/block/InfoBlock.tsx
function InfoBlock({
  children,
  className,
  contentMaxHeight,
  icon,
  link,
  rightTitle,
  title,
  titleClassName,
}) {
  const style = useMemo(() => {
    if (contentMaxHeight) {
      return {
        maxHeight: contentMaxHeight,
        overflowY: 'auto',
      };
    }
    return {};
  }, [contentMaxHeight]);
  return jsxs('div', {
    class: 'gl-relative gl-w-full gl-py-2 gl-border-b gl-border-b-solid',
    style: { borderColor: 'var(--gl-border-color-subtle)' },
    children: [
      jsxs(Row, {
        className: 'gl-px-3',
        items: 'center',
        justify: 'between',
        children: [
          jsxs(Row, {
            gap: 2,
            items: 'center',
            children: [
              icon && jsx(GitlabIcon, { icon, size: 16 }),
              jsxs('h5', {
                className: clsx('gl-my-0', titleClassName),
                children: [
                  title,
                  link &&
                    jsx(Link, {
                      className: 'gl-ml-3',
                      href: link,
                      blockHover: true,
                      inline: true,
                      children: jsx(GitlabIcon, { icon: 'symlink', size: 16 }),
                    }),
                ],
              }),
            ],
          }),
          rightTitle,
        ],
      }),
      jsx('div', {
        style,
        children: jsx('div', { class: clsx('gl-px-3', className), children }),
      }),
    ],
  });
}

// apps/gitlab-plus/src/components/common/block/HeadingBlock.tsx
function HeadingBlock({
  author,
  badge,
  createdAt,
  entityId,
  icon,
  link,
  onRefresh,
  title,
}) {
  return jsxs(InfoBlock, {
    link,
    title,
    titleClassName: 'gl-pr-2',
    rightTitle:
      onRefresh &&
      jsx('div', {
        onClick: onRefresh,
        className: 'gl-absolute gl-right-0 gl-top-1 gl-p-2 gl-cursor-pointer',
        children: jsx(GitlabIcon, { icon: 'repeat' }),
      }),
    children: [
      jsxs(Row, {
        className: 'gl-mt-2',
        gap: 2,
        items: 'center',
        children: [
          jsxs(Row, {
            gap: 2,
            items: 'center',
            children: [
              jsx(GitlabIcon, { icon, size: 16 }),
              jsx(Text, {
                size: 'sm',
                variant: 'secondary',
                weight: 'bold',
                children: entityId,
              }),
            ],
          }),
          badge,
        ],
      }),
      jsxs(Row, {
        className: 'gl-mt-1',
        gap: 2,
        items: 'center',
        children: [
          jsx(Text, {
            size: 'sm',
            variant: 'secondary',
            children: 'Created at',
          }),
          jsx(Text, {
            size: 'sm',
            weight: 'bold',
            children: new Date(createdAt).toLocaleDateString(),
          }),
          jsx(Text, { size: 'sm', variant: 'secondary', children: 'by' }),
          jsx(GitlabUser, {
            size: 16,
            user: author,
            smallText: true,
            withLink: true,
          }),
        ],
      }),
    ],
  });
}

// apps/gitlab-plus/src/components/common/GitlabBadge.tsx
function GitlabBadge({ icon, label, title, variant }) {
  return jsxs('span', {
    className: `gl-badge badge badge-pill badge-${variant}`,
    title,
    children: [
      icon && jsx(GitlabIcon, { icon }),
      label && jsx('span', { className: 'gl-badge-content', children: label }),
    ],
  });
}

// apps/gitlab-plus/src/components/common/IssueStatus.tsx
function IssueStatus$1({ isOpen }) {
  return jsx(GitlabBadge, {
    icon: isOpen ? 'issue-open-m' : 'issue-close',
    label: isOpen ? 'Open' : 'Closed',
    variant: isOpen ? 'success' : 'info',
  });
}

// apps/gitlab-plus/src/components/epic-preview/blocks/EpicHeading.tsx
function EpicHeader({ epic, onRefresh }) {
  return jsx(HeadingBlock, {
    author: epic.author,
    badge: jsx(IssueStatus$1, { isOpen: epic.state === 'OPEN' }),
    createdAt: epic.createdAt,
    entityId: `&${epic.iid}`,
    icon: 'epic',
    link: epic.webUrl,
    onRefresh,
    title: epic.title,
  });
}

// apps/gitlab-plus/src/components/common/block/useChangeStatusSelect.ts
const name = 'status-labels';

function useChangeStatusSelect({
  getStatusLabels,
  onStausLabelUpdate,
  statusLabel,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusLabels, setStatusLabels] = useState([]);
  const filterValues = useCallback(
    async (search) => {
      return statusLabels
        .filter((option) => option.title.includes(search))
        .filter(
          (label) =>
            label.id !== (statusLabel == null ? void 0 : statusLabel.id)
        );
    },
    [statusLabels]
  );
  const onSelectStatus = useCallback(
    async (label) => {
      setIsLoading(true);
      await onStausLabelUpdate(label);
      new RecentlyProvider(name).add(label);
      setIsLoading(false);
    },
    [onStausLabelUpdate]
  );
  useEffect(() => {
    getStatusLabels().then((labels2) => setStatusLabels(labels2));
  }, []);
  return {
    filterValues,
    isLoading,
    name,
    onSelectStatus,
  };
}

// apps/gitlab-plus/src/components/common/block/ChangeStatusSelect.tsx
function ChangeStatusSelect({
  width = 130,
  getStatusLabels,
  label = 'Change status',
  onStausLabelUpdate,
  statusLabel,
}) {
  const {
    filterValues,
    isLoading,
    name: name2,
    onSelectStatus,
  } = useChangeStatusSelect({
    getStatusLabels,
    onStausLabelUpdate,
    statusLabel,
  });
  if (isLoading) {
    return jsx(GitlabLoader, {});
  }
  const renderOption = useCallback((item) => {
    return jsxs('div', {
      class: 'gl-flex gl-flex-1 gl-break-anywhere gl-pb-3 gl-pl-4 gl-pt-3',
      children: [
        jsx('span', {
          class: 'dropdown-label-box gl-top-0 gl-mr-3 gl-shrink-0',
          style: { backgroundColor: item.color },
        }),
        jsx('span', { children: item.title }),
      ],
    });
  }, []);
  return jsx('div', {
    className: 'gl-py-2',
    style: { width },
    title: `Current ${statusLabel == null ? void 0 : statusLabel.title}`,
    children: jsx(AsyncAutocomplete, {
      hideCheckbox: true,
      buttonSize: 'sm',
      getValues: filterValues,
      name: name2,
      onChange: ([label2]) => label2 && onSelectStatus(label2),
      renderLabel: () => label,
      renderOption,
      value: [],
    }),
  });
}

// apps/gitlab-plus/src/components/common/block/LabelsBlock.tsx
function LabelsBlock({ labels: labels2, updateStatus }) {
  if (!labels2.length && !updateStatus) {
    return null;
  }
  return jsx(InfoBlock, {
    className: 'issuable-show-labels',
    icon: 'labels',
    title: 'Labels',
    rightTitle:
      updateStatus &&
      jsx(ChangeStatusSelect, {
        getStatusLabels: updateStatus.getStatusLabels,
        onStausLabelUpdate: updateStatus.onStausLabelUpdate,
        statusLabel: updateStatus.statusLabel,
      }),
    children: labels2.map((label) => jsx(GitlabLabel, { label }, label.id)),
  });
}

// apps/gitlab-plus/src/components/common/hooks/useEpicLabels.ts
function useEpicLabels({ epic, link, refetch }) {
  const { labels: labels2, statusLabel } = useMemo(() => {
    const labels22 = LabelHelper.getLabelsFromWidgets(
      epic == null ? void 0 : epic.widgets
    );
    return {
      labels: labels22,
      statusLabel: LabelHelper.getStatusLabel(labels22),
    };
  }, [epic]);
  const onStatusChange = useCallback(
    async (label) => {
      if (!epic) {
        return;
      }
      await new EpicProvider().updateEpicLabels(
        epic.id,
        [label.id],
        statusLabel ? [statusLabel.id] : []
      );
      if (refetch) {
        await refetch();
      }
    },
    [labels2, statusLabel]
  );
  const fetchStatusLabels = useCallback(async () => {
    const response = await new LabelsProvider().getWorkspaceLabels(
      link.workspacePath,
      LabelHelper.getStatusPrefix()
    );
    return response.data.workspace.labels.nodes;
  }, []);
  return {
    labels: labels2,
    updateStatus: {
      getStatusLabels: fetchStatusLabels,
      onStausLabelUpdate: onStatusChange,
      statusLabel,
    },
  };
}

// apps/gitlab-plus/src/components/epic-preview/blocks/EpicLabels.tsx
function EpicLabels({ epic, link, refresh }) {
  const { labels: labels2, updateStatus } = useEpicLabels({
    epic,
    link,
    refetch: refresh,
  });
  if (!labels2.length) {
    return null;
  }
  return jsx(LabelsBlock, { labels: labels2, updateStatus });
}

// apps/gitlab-plus/src/components/common/block/ListBlock.tsx
function ListBlock({ itemId, items, maxHeight = 100, renderItem, ...props }) {
  if (!items.length) {
    return null;
  }
  return jsx(InfoBlock, {
    contentMaxHeight: maxHeight,
    ...props,
    children: items.map((item) =>
      jsx(Fragment, { children: renderItem(item) }, itemId(item))
    ),
  });
}

// apps/gitlab-plus/src/components/common/StatusIndicator.tsx
function StatusIndicator({ label }) {
  if (!label) {
    return null;
  }
  return jsx('div', {
    title: label.title,
    style: {
      minWidth: 10,
      width: 10,
      backgroundColor: label.color,
      borderRadius: 10,
      height: 10,
      marginRight: 2,
    },
  });
}

// apps/gitlab-plus/src/components/epic-preview/blocks/EpicRelatedIssues.tsx
function EpicRelatedIssues({ epic }) {
  const issues = useMemo(() => {
    let _a;
    const hierarchyWidget = WidgetHelper.getWidget(
      epic.widgets,
      WidgetType.hierarchy
    );
    return (
      ((_a = hierarchyWidget == null ? void 0 : hierarchyWidget.children) ==
      null
        ? void 0
        : _a.nodes) || []
    );
  }, [epic]);
  return jsx(ListBlock, {
    icon: 'issue-type-issue',
    itemId: (i) => i.iid,
    items: issues,
    title: `Child issues (${issues.length})`,
    renderItem: (issue) =>
      jsxs(Link, {
        href: issue.webUrl,
        title: issue.title,
        children: [
          jsx(StatusIndicator, {
            label: LabelHelper.getStatusLabelFromWidgets(issue.widgets),
          }),
          '#',
          issue.iid,
          ' ',
          issue.title,
        ],
      }),
  });
}

// apps/gitlab-plus/src/components/common/modal/useFetchEntity.ts
function useFetchEntity(fetcher) {
  const [entityData, setEntityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetch2 = async (link, force = false) => {
    if (force) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    const entity = await fetcher(link, force);
    setEntityData({ entity, link });
    setIsRefreshing(false);
    setIsLoading(false);
  };
  const reset = () => {
    setEntityData(null);
    setIsRefreshing(false);
    setIsLoading(false);
  };
  return {
    entityData,
    fetch: fetch2,
    isLoading,
    isRefreshing,
    onRefresh: async () => {
      if (entityData) {
        await fetch2(entityData.link, true);
      }
    },
    reset,
  };
}

// apps/gitlab-plus/src/components/epic-preview/useFetchEpic.ts
function useFetchEpic() {
  return useFetchEntity(async (link, force = false) => {
    const response = await new EpicProvider(force).getEpic(
      link.workspacePath,
      link.epic
    );
    return response.data.workspace.workItem;
  });
}

// apps/gitlab-plus/src/components/epic-preview/EpicPreviewModal.tsx
function EpicPreviewModal() {
  const {
    entityData,
    fetch: fetch2,
    isLoading,
    isRefreshing,
    reset,
  } = useFetchEpic();
  return jsx(PreviewModal, {
    validator: LinkParser.validateEpicLink,
    fetch: fetch2,
    isError: !entityData,
    isLoading,
    isRefreshing,
    parser: LinkParser.parseEpicLink,
    reset,
    children:
      entityData &&
      jsxs(Fragment, {
        children: [
          jsx(EpicHeader, {
            epic: entityData.entity,
            onRefresh: () => fetch2(entityData.link, true),
          }),
          jsx(EpicLabels, {
            epic: entityData.entity,
            link: entityData.link,
            refresh: () => fetch2(entityData.link, true),
          }),
          jsx(EpicRelatedIssues, { epic: entityData.entity }),
        ],
      }),
  });
}

// apps/gitlab-plus/src/services/EpicPreview.tsx
class EpicPreview extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.EpicPreview);
  }

  init() {
    RendererHelper.renderInBody(
      'glp-epic-preview-root',
      jsx(EpicPreviewModal, {})
    );
  }
}

// apps/gitlab-plus/src/components/epic-status-select/useEpicStatusSelect.ts
function useEpicStatusSelect({ link }) {
  const { entityData, fetch: fetch2, onRefresh } = useFetchEpic();
  const { updateStatus } = useEpicLabels({
    epic: entityData == null ? void 0 : entityData.entity,
    link,
    refetch: onRefresh,
  });
  useEffect(() => {
    fetch2(link);
  }, []);
  return updateStatus;
}

// apps/gitlab-plus/src/components/epic-status-select/EpicStatusSelect.tsx
function EpicStatusSelect({ link }) {
  const updateStatus = useEpicStatusSelect({ link });
  return jsx(ChangeStatusSelect, {
    ...updateStatus,
    width: 75,
    label: 'Status',
  });
}

// libs/share/src/ui/Observer.ts
class Observer {
  start(element, callback, options) {
    this.stop();
    this.observer = new MutationObserver(callback);
    this.observer.observe(
      element,
      options || {
        attributeOldValue: true,
        attributes: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true,
      }
    );
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// apps/gitlab-plus/src/services/DrawerWorkItemStatus.tsx
class DrawerWorkItemStatus {
  constructor(tag, parser, renderer) {
    __publicField(
      this,
      'btnQuery',
      'aside [data-testid="work-item-labels"] [data-testid="edit-button"]'
    );
    this.tag = tag;
    this.parser = parser;
    this.renderer = renderer;
    new Observer().start(document.body, this.onBodyChange.bind(this), {
      childList: true,
      subtree: true,
    });
  }

  initDrawerStatusSelect(aside, attempt = 0) {
    let _a;
    if (attempt > 10) {
      return;
    }
    const link = this.parser(
      ((_a = aside.querySelector(
        '[data-testid="work-item-drawer-ref-link"]'
      )) == null
        ? void 0
        : _a.href) || ''
    );
    if (!link) {
      return;
    }
    const editButton = aside.querySelector(this.btnQuery);
    if (!editButton) {
      window.setTimeout(
        () => this.initDrawerStatusSelect(aside, attempt + 1),
        500
      );
      return;
    }
    RendererHelper.render(
      `glp-${this.tag}-status-select`,
      editButton,
      this.renderer(link),
      'after'
    );
  }

  onBodyChange(mutations) {
    const addedNodes = mutations.flatMap((mutation) => [
      ...mutation.addedNodes,
    ]);
    const aside = addedNodes.find((node) => node.tagName === 'ASIDE');
    if (aside && aside.dataset.testid === 'work-item-drawer') {
      this.initDrawerStatusSelect(aside);
    }
  }
}

// apps/gitlab-plus/src/services/EpicStatus.tsx
class EpicStatus extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.EpicStatus);
  }

  init() {
    console.log(
      LinkParser.validateEpicLink(window.location.href),
      LinkParser.parseEpicLink(window.location.href)
    );
    this.setup(
      this.initEpicStatusSelect.bind(this),
      LinkParser.validateEpicLink
    );
    new DrawerWorkItemStatus('epic', LinkParser.parseEpicLink, (link) =>
      jsx(EpicStatusSelect, { link })
    );
  }

  initEpicStatusSelect() {
    this.ready = RendererHelper.renderWithLink(
      'glp-epic-status-select',
      '[data-testid="work-item-labels"] [data-testid="edit-button"]',
      LinkParser.parseEpicLink,
      (link) => jsx(EpicStatusSelect, { link }),
      'after'
    );
  }
}

// apps/gitlab-plus/src/components/image-preview/useImagePreviewModal.ts
function useImagePreviewModal() {
  const [zoom, setZoom] = useState('contains');
  const [src, setSrc] = useState('');
  const validate = (element) => {
    return (
      element.classList.contains('no-attachment-icon') &&
      /\.(png|jpg|jpeg|heic)$/.test(element.href.toLowerCase())
    );
  };
  const getAnchor = (element) => {
    if (!element) {
      return void 0;
    }
    if (element instanceof HTMLAnchorElement) {
      return validate(element) ? element : void 0;
    }
    if (
      element instanceof HTMLImageElement &&
      element.parentElement instanceof HTMLAnchorElement
    ) {
      return validate(element.parentElement) ? element.parentElement : void 0;
    }
    return void 0;
  };
  useEffect(() => {
    document.body.addEventListener('click', (ev) => {
      const anchor = getAnchor(ev.target);
      if (anchor) {
        setSrc(anchor.href);
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }
    });
  }, []);
  const style = useMemo(() => {
    if (zoom === 'auto') {
      return {
        cursor: 'zoom-out',
        display: 'block',
        margin: '0 auto',
        padding: 15,
      };
    }
    return {
      maxWidth: '95vw',
      cursor: 'zoom-in',
      display: 'block',
      margin: '0 auto',
      maxHeight: '95vh',
    };
  }, [zoom]);
  return {
    onClose: () => {
      setSrc('');
      setZoom('contains');
    },
    onZoom: () => setZoom(zoom === 'auto' ? 'contains' : 'auto'),
    src,
    style,
  };
}

// apps/gitlab-plus/src/components/image-preview/ImagePreviewModal.tsx
function ImagePreviewModal() {
  const { onClose, onZoom, src, style } = useImagePreviewModal();
  return jsxs('div', {
    className: clsx(
      'glp-image-preview-modal',
      Boolean(src) && 'glp-modal-visible'
    ),
    children: [
      jsx('div', {
        className:
          'gl-flex gl-items-center gl-overflow-auto gl-h-full gl-w-full',
        children: jsx('img', {
          alt: 'Image preview',
          onClick: onZoom,
          src,
          style,
        }),
      }),
      jsx('div', {
        className: 'glp-modal-close',
        onClick: onClose,
        children: jsx(GitlabIcon, { icon: 'close-xs', size: 24 }),
      }),
    ],
  });
}

// apps/gitlab-plus/src/services/ImagePreview.tsx
class ImagePreview extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.ImagePreview);
  }

  init() {
    RendererHelper.renderInBody(
      'glp-image-preview-root',
      jsx(ImagePreviewModal, {})
    );
  }
}

// apps/gitlab-plus/src/components/common/block/UsersBlock.tsx
function UsersBlock({
  assign,
  icon,
  label,
  pluralIcon,
  pluralLabel,
  users = [],
}) {
  if (!users.length && !assign) {
    return null;
  }
  if (!users.length && assign) {
    return jsx(InfoBlock, {
      icon: icon || 'user',
      title: `${label}:`,
      rightTitle: assign.isLoading
        ? jsx(GitlabLoader, {})
        : jsx(GitlabButton, {
            onClick: assign.onUpdate,
            children: 'Assign yourself',
          }),
    });
  }
  if (users.length === 1) {
    return jsx(InfoBlock, {
      icon: icon || 'user',
      rightTitle: jsx(GitlabUser, { user: users[0], withLink: true }),
      title: `${label}:`,
    });
  }
  return jsx(ListBlock, {
    className: 'gl-flex gl-flex-col gl-gap-3',
    icon: pluralIcon || icon || 'users',
    itemId: (u) => u.id,
    items: users,
    renderItem: (user) => jsx(GitlabUser, { user, withLink: true }),
    title: pluralLabel || `${label}s`,
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/useIssueAssignees.ts
function useIssueAssignees({ issue, link, refetch }) {
  const [isLoading, setIsLoading] = useState(false);
  const onUpdate = useCallback(async () => {
    setIsLoading(true);
    const user = await new UsersProvider().getCurrentUser();
    await new IssueProvider().issueSetAssignees({
      iid: issue.iid,
      assigneeUsernames: [user.data.currentUser.username],
      projectPath: link.projectPath,
    });
    setIsLoading(false);
    refetch == null ? void 0 : refetch();
  }, []);
  return {
    isLoading,
    onUpdate,
  };
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueAssignees.tsx
function IssueAssignees({ issue, link, refetch }) {
  const { isLoading, onUpdate } = useIssueAssignees({ issue, link, refetch });
  return jsx(UsersBlock, {
    assign: { isLoading, onUpdate },
    icon: 'assignee',
    label: 'Assignee',
    users: issue.assignees.nodes,
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueEpic.tsx
function IssueEpic({ issue }) {
  let _a;
  if (!issue.epic) {
    return null;
  }
  return jsx(InfoBlock, {
    icon: 'epic',
    title: 'Epic',
    children: jsxs(Link, {
      href: issue.epic.webUrl,
      title: issue.epic.title,
      children: [
        jsx(StatusIndicator, {
          label: LabelHelper.getStatusLabel(
            (_a = issue.epic.labels) == null ? void 0 : _a.nodes
          ),
        }),
        issue.epic.title,
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueHeading.tsx
function IssueHeader({ issue, onRefresh }) {
  return jsx(HeadingBlock, {
    author: issue.author,
    badge: jsx(IssueStatus$1, { isOpen: issue.state === 'opened' }),
    createdAt: issue.createdAt,
    entityId: `#${issue.iid}`,
    icon: 'issue-type-issue',
    link: issue.webUrl,
    onRefresh,
    title: issue.title,
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueIteration.tsx
function IssueIteration({ issue }) {
  const label = useMemo(() => {
    let _a;
    const date = (date2) => {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
      }).format(new Date(date2));
    };
    if (!issue.iteration) {
      return '';
    }
    return [
      (_a = issue.iteration.iterationCadence) == null ? void 0 : _a.title,
      ': ',
      date(issue.iteration.startDate),
      ' - ',
      date(issue.iteration.dueDate),
    ].join('');
  }, [issue]);
  if (!issue.iteration) {
    return null;
  }
  return jsx(InfoBlock, {
    icon: 'iteration',
    rightTitle: label,
    title: 'Iteration',
  });
}

// apps/gitlab-plus/src/components/common/hooks/useIssueLabels.ts
function useIssueLabels({ issue, link, refetch }) {
  const { labels: labels2, statusLabel } = useMemo(() => {
    const labels22 = (issue == null ? void 0 : issue.labels.nodes) || [];
    return {
      labels: labels22,
      statusLabel: LabelHelper.getStatusLabel(labels22),
    };
  }, [issue]);
  const onStatusChange = useCallback(
    async (label) => {
      const updatedLabels = [
        ...labels2.filter(
          (label2) =>
            label2.id !== (statusLabel == null ? void 0 : statusLabel.id)
        ),
        label,
      ];
      if (!issue) {
        return;
      }
      await new IssueProvider().issueSetLabels({
        iid: issue.iid,
        labelIds: updatedLabels.map((l) => l.id),
        projectPath: link.projectPath,
      });
      if (refetch) {
        await refetch();
      }
    },
    [issue, labels2, statusLabel]
  );
  const fetchStatusLabels = useCallback(async () => {
    const response = await new LabelsProvider().getProjectLabels(
      link.projectPath,
      LabelHelper.getStatusPrefix()
    );
    return response.data.workspace.labels.nodes;
  }, []);
  return {
    labels: labels2,
    updateStatus: {
      getStatusLabels: fetchStatusLabels,
      onStausLabelUpdate: onStatusChange,
      statusLabel: LabelHelper.getStatusLabel(labels2),
    },
  };
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueLabels.tsx
function IssueLabels({ issue, link, refetch }) {
  const { labels: labels2, updateStatus } = useIssueLabels({
    issue,
    link,
    refetch,
  });
  if (!labels2.length && !updateStatus) {
    return null;
  }
  return jsx(LabelsBlock, { labels: labels2, updateStatus });
}

// apps/gitlab-plus/src/components/common/MrStatus.tsx
const iconMap = {
  closed: 'merge-request-close',
  locked: 'search',
  merged: 'merge',
  opened: 'merge-request',
};
const classMap = {
  closed: 'danger',
  locked: 'warning',
  merged: 'info',
  opened: 'success',
};
const labelMap = {
  closed: 'Closed',
  locked: 'Locked',
  merged: 'Merged',
  opened: 'Opened',
};

function MrStatus({ state, withIcon, withLabel }) {
  return jsx(GitlabBadge, {
    icon: withIcon ? iconMap[state] : void 0,
    label: withLabel ? labelMap[state] : void 0,
    variant: classMap[state],
  });
}

// apps/gitlab-plus/src/components/common/GitlabMergeRequest.tsx
function GitlabMergeRequest({ mr }) {
  return jsxs('div', {
    style: { marginTop: 10 },
    children: [
      jsxs(Row, {
        gap: 2,
        children: [
          jsx(MrStatus, { state: mr.state, withIcon: true, withLabel: true }),
          jsxs(Text, { variant: 'secondary', children: ['!', mr.iid] }),
          jsx(GitlabUser, { size: 16, user: mr.author, withLink: true }),
        ],
      }),
      jsx(Link, { href: mr.webUrl, title: mr.title, children: mr.title }),
    ],
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueMergeRequests.tsx
function IssueMergeRequests({ issue }) {
  return jsx(ListBlock, {
    icon: 'merge-request',
    itemId: (mr) => mr.iid,
    items: issue.relatedMergeRequests.nodes,
    renderItem: (mr) => jsx(GitlabMergeRequest, { mr }),
    title: 'Merge requests',
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueMilestone.tsx
function IssueMilestone({ issue }) {
  if (!issue.milestone) {
    return null;
  }
  return jsx(InfoBlock, {
    icon: 'milestone',
    rightTitle: issue.milestone.title,
    title: 'Milestone',
  });
}

// apps/gitlab-plus/src/components/issue-preview/blocks/IssueRelatedIssue.tsx
const relationMap = {
  blocks: 'Blocks',
  is_blocked_by: 'Is blocked by',
  relates_to: 'Related to',
};

function IssueRelatedIssue({ issue }) {
  const groups = useMemo(() => {
    return Object.entries(
      issue.linkedWorkItems.nodes.reduce(
        (acc, issue2) => ({
          ...acc,
          [issue2.linkType]: [...acc[issue2.linkType], issue2],
        }),
        {
          blocks: [],
          is_blocked_by: [],
          relates_to: [],
        }
      )
    ).filter(([_, issues]) => issues.length);
  }, [issue]);
  if (!issue.linkedWorkItems.nodes.length) {
    return null;
  }
  return groups.map(([key, issues]) =>
    jsx(
      ListBlock,
      {
        itemId: (i) => i.workItem.iid,
        items: issues,
        title: `${relationMap[key]} (${issues.length}):`,
        renderItem: (issue2) =>
          jsxs(Link, {
            href: issue2.workItem.webUrl,
            blockHover: true,
            children: [
              jsx(StatusIndicator, {
                label: LabelHelper.getStatusLabelFromWidgets(
                  issue2.workItem.widgets
                ),
              }),
              '#',
              issue2.workItem.iid,
              ' ',
              issue2.workItem.title,
            ],
          }),
      },
      key
    )
  );
}

// apps/gitlab-plus/src/components/issue-preview/useFetchIssue.ts
function useFetchIssue() {
  return useFetchEntity(async (link, force = false) => {
    const response = await new IssueProvider(force).getIssue(
      link.projectPath,
      link.issue
    );
    return response.data.project.issue;
  });
}

// apps/gitlab-plus/src/components/issue-preview/IssuePreviewModal.tsx
function IssuePreviewModal() {
  const {
    entityData,
    fetch: fetch2,
    isLoading,
    isRefreshing,
    onRefresh,
    reset,
  } = useFetchIssue();
  return jsx(PreviewModal, {
    validator: LinkParser.validateIssueLink,
    fetch: fetch2,
    isError: !entityData,
    isLoading,
    isRefreshing,
    parser: LinkParser.parseIssueLink,
    reset,
    children:
      entityData &&
      jsxs(Fragment, {
        children: [
          jsx(IssueHeader, { issue: entityData.entity, onRefresh }),
          jsx(IssueAssignees, {
            issue: entityData.entity,
            link: entityData.link,
            refetch: onRefresh,
          }),
          jsx(IssueLabels, {
            issue: entityData.entity,
            link: entityData.link,
            refetch: onRefresh,
          }),
          jsx(IssueEpic, { issue: entityData.entity }),
          jsx(IssueMilestone, { issue: entityData.entity }),
          jsx(IssueIteration, { issue: entityData.entity }),
          jsx(IssueMergeRequests, { issue: entityData.entity }),
          jsx(IssueRelatedIssue, { issue: entityData.entity }),
        ],
      }),
  });
}

// apps/gitlab-plus/src/services/IssuePreview.tsx
class IssuePreview extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.IssuePreview);
  }

  init() {
    RendererHelper.renderInBody(
      'glp-issue-preview-root',
      jsx(IssuePreviewModal, {})
    );
  }
}

// apps/gitlab-plus/src/components/issue-status-select/useIssueStatusSelect.ts
function useIssueStatusSelect({ link }) {
  const { entityData, fetch: fetch2, onRefresh } = useFetchIssue();
  const { updateStatus } = useIssueLabels({
    issue: entityData == null ? void 0 : entityData.entity,
    link,
    refetch: onRefresh,
  });
  useEffect(() => {
    fetch2(link);
  }, []);
  return updateStatus;
}

// apps/gitlab-plus/src/components/issue-status-select/IssueStatusSelect.tsx
function IssueStatusSelect({ link }) {
  const updateStatus = useIssueStatusSelect({ link });
  return jsx(ChangeStatusSelect, {
    ...updateStatus,
    width: 75,
    label: 'Status',
  });
}

// apps/gitlab-plus/src/services/IssueStatus.tsx
class IssueStatus extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.IssueStatus);
  }

  init() {
    this.setup(
      this.initIssuesStausSelect.bind(this),
      LinkParser.validateIssueLink
    );
    new DrawerWorkItemStatus('issue', LinkParser.parseIssueLink, (link) =>
      jsx(IssueStatusSelect, { link })
    );
  }

  async initIssuesStausSelect() {
    this.ready = RendererHelper.renderWithLink(
      'glp-issue-status-select',
      '[data-testid="work-item-labels"] [data-testid="edit-button"]',
      LinkParser.parseIssueLink,
      (link) => jsx(IssueStatusSelect, { link }),
      'after'
    );
  }
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrApprovedBy.tsx
function MrApprovedBy({ mr }) {
  return jsx(UsersBlock, {
    label: 'Approved by',
    pluralLabel: 'Approved by',
    users: mr.approvedBy.nodes,
  });
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrAssignee.tsx
function MrAssignee({ mr }) {
  return jsx(UsersBlock, {
    icon: 'assignee',
    label: 'Assignee',
    users: mr.assignees.nodes,
  });
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrBranch.tsx
function MrBranch({ mr }) {
  return jsx(InfoBlock, {
    icon: 'branch',
    title: 'Merge',
    children: jsxs('span', {
      children: [
        jsx(Text, { children: mr.sourceBranch }),
        jsx(Text, {
          className: 'gl-mx-2',
          variant: 'secondary',
          children: 'in to',
        }),
        jsx(Text, { children: mr.targetBranch }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrDiff.tsx
function MrDiff({ mr }) {
  const label = useMemo(() => {
    if (mr.diffStatsSummary.fileCount === 1) {
      return '1 file';
    }
    return `${mr.diffStatsSummary.fileCount} files`;
  }, [mr.diffStatsSummary.fileCount]);
  return jsx(InfoBlock, {
    icon: 'commit',
    title: `Commit: ${mr.commitCount}`,
    rightTitle: jsxs(Row, {
      gap: 2,
      items: 'center',
      children: [
        jsx(GitlabIcon, { icon: 'doc-code', size: 16 }),
        jsx(Text, { size: 'subtle', weight: 'bold', children: label }),
        jsxs(Text, {
          color: 'success',
          weight: 'bold',
          children: ['+', mr.diffStatsSummary.additions],
        }),
        jsxs(Text, {
          color: 'danger',
          weight: 'bold',
          children: ['-', mr.diffStatsSummary.deletions],
        }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrDiscussion.tsx
function MrDiscussion({ mr }) {
  const [resolved, total] = [
    mr.resolvedDiscussionsCount,
    mr.resolvableDiscussionsCount,
  ];
  if (!total) {
    return null;
  }
  const { label, title } = useMemo(() => {
    const plural = total !== 1 ? 's' : '';
    return {
      label: `${resolved} of ${total}`,
      title: `${resolved} of ${total} thread${plural} resolved`,
    };
  }, [mr]);
  return jsx(InfoBlock, {
    icon: 'comments',
    title: 'Discussion',
    rightTitle: jsx(GitlabBadge, {
      icon: 'comments',
      label,
      title,
      variant: resolved === total ? 'success' : 'muted',
    }),
  });
}

// libs/share/src/utils/textWithChild.ts
function textWithChild(text, pattern, replacer) {
  const matches = text.match(RegExp(pattern, 'g'));
  const parts = text.split(RegExp(pattern, 'g'));
  if (!(matches == null ? void 0 : matches.length)) {
    return text;
  }
  return parts.reduce((items, text2, index) => {
    const textToReplace = index < matches.length ? matches[index] : void 0;
    return [
      ...items,
      text2,
      ...(textToReplace ? [replacer(textToReplace)] : []),
    ];
  }, []);
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrHeading.tsx
function MrHeader({ mr, onRefresh }) {
  const title = useMemo(() => {
    const issueLink = (id) =>
      `${mr.project.webUrl}/-/issues/${id.replace(/\D+/g, '')}`;
    return textWithChild(mr.title, /#\d+/, (id) =>
      jsx(Link, { href: issueLink(id), inline: true, children: id })
    );
  }, [mr]);
  return jsx(HeadingBlock, {
    author: mr.author,
    createdAt: mr.createdAt,
    entityId: `!${mr.iid}`,
    icon: 'merge-request',
    link: mr.webUrl,
    onRefresh,
    title,
    badge: jsxs(Row, {
      className: 'gl-gap-2',
      items: 'center',
      children: [
        jsx(MrStatus, { state: mr.state, withIcon: true, withLabel: true }),
        Boolean(mr.approvedBy.nodes.length) &&
          jsx(GitlabBadge, {
            icon: 'check-circle',
            label: 'Approved',
            variant: 'success',
          }),
        mr.conflicts &&
          jsx(GitlabIcon, {
            icon: 'warning-solid',
            size: 16,
            title: 'Merge request can not be merged',
          }),
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/mr-preview/blocks/MrLabels.tsx
function MrLabels({ mr }) {
  if (!mr.labels.nodes.length) {
    return null;
  }
  return jsx(InfoBlock, {
    className: 'issuable-show-labels',
    title: 'Labels',
    children: mr.labels.nodes.map((label) =>
      jsx(GitlabLabel, { label }, label.id)
    ),
  });
}

// apps/gitlab-plus/src/providers/query/mr.ts
const mrQuery = `query MergeRequestQuery($fullPath: ID!, $iid: String!) {
  workspace: project(fullPath: $fullPath) {
    mergeRequest(iid: $iid) {
      id
      iid
      assignees {
        nodes {
          ...UserFragment
        }
      }
      approvedBy {
        nodes {
          ...UserFragment
        }
      }
      author {
        ...UserFragment
      }
      project {
        webUrl
        path
        fullPath
      }
      commitCount
      conflicts
      createdAt
      title
      titleHtml
      diffStatsSummary {
        additions
        changes
        deletions
        fileCount
      }
      draft
      labels {
        nodes {
          ...LabelFragment
        }
      }
      mergeable
      resolvedDiscussionsCount
      resolvableDiscussionsCount
      reviewers {
        nodes {
          ...UserFragment
        }
      }
      shouldBeRebased
      sourceBranch
      targetBranch
      state
      webUrl
    }
  }
}

${userFragment}
${labelFragment}
`;

// apps/gitlab-plus/src/providers/MrProvider.ts
class MrProvider extends GitlabProvider {
  async getMr(projectPath, mrId) {
    return this.queryCached(
      `mr-${projectPath}-${mrId}`,
      mrQuery,
      {
        iid: mrId,
        fullPath: projectPath,
      },
      2
    );
  }
}

// apps/gitlab-plus/src/components/mr-preview/useFetchMr.ts
function useFetchMr() {
  return useFetchEntity(async (link, force = false) => {
    const response = await new MrProvider(force).getMr(
      link.projectPath,
      link.mr
    );
    return response.data.workspace.mergeRequest;
  });
}

// apps/gitlab-plus/src/components/mr-preview/MrPreviewModal.tsx
function MrPreviewModal() {
  const {
    entityData,
    fetch: fetch2,
    isLoading,
    isRefreshing,
    reset,
  } = useFetchMr();
  return jsx(PreviewModal, {
    validator: LinkParser.validateMrLink,
    fetch: fetch2,
    isError: !entityData,
    isLoading,
    isRefreshing,
    parser: LinkParser.parseMrLink,
    reset,
    children:
      entityData &&
      jsxs(Fragment, {
        children: [
          jsx(MrHeader, {
            mr: entityData.entity,
            onRefresh: () => fetch2(entityData.link, true),
          }),
          jsx(MrBranch, { mr: entityData.entity }),
          jsx(MrAssignee, { mr: entityData.entity }),
          jsx(MrApprovedBy, { mr: entityData.entity }),
          jsx(MrLabels, { mr: entityData.entity }),
          jsx(MrDiff, { mr: entityData.entity }),
          jsx(MrDiscussion, { mr: entityData.entity }),
        ],
      }),
  });
}

// apps/gitlab-plus/src/services/MrPreview.tsx
class MrPreview extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.MrPreview);
  }

  init() {
    RendererHelper.renderInBody('glp-mr-preview-root', jsx(MrPreviewModal, {}));
  }
}

// apps/gitlab-plus/src/components/related-issue-autocomplete/useRelatedIssuesAutocompleteModal.ts
function useRelatedIssuesAutocompleteModal(link, input) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const searchIssues = useCallback(async (term) => {
    const response = await new IssueProvider().getIssues(
      link.workspacePath,
      term
    );
    return [
      response.data.workspace.workItems,
      response.data.workspace.workItemsByIid,
      response.data.workspace.workItemsEmpty,
    ].flatMap((item) => (item == null ? void 0 : item.nodes) || []);
  }, []);
  const options = useAsyncAutocompleteOptions(searchTerm, searchIssues);
  const onSelect = (item) => {
    input.value = `${item.project.fullPath}#${item.iid} `;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
  };
  useEffect(() => {
    document.body.addEventListener('click', (e) => {
      if (e.target !== input && !input.contains(e.target)) {
        setIsVisible(false);
      }
    });
    input.addEventListener('click', () => setIsVisible(true));
  }, []);
  return {
    isVisible,
    onClose: () => setIsVisible(false),
    onSelect,
    options,
    searchTerm,
    setSearchTerm,
  };
}

// apps/gitlab-plus/src/components/related-issue-autocomplete/RelatedIssuesAutocompleteModal.tsx
function RelatedIssuesAutocompleteModal({ input, link }) {
  const { isVisible, onClose, onSelect, options, searchTerm, setSearchTerm } =
    useRelatedIssuesAutocompleteModal(link, input);
  if (!isVisible) {
    return null;
  }
  return jsx('div', {
    class: 'gl-relative gl-w-full gl-new-dropdown !gl-block',
    children: jsx(AsyncAutocompleteDropdown, {
      hideCheckbox: true,
      onClick: onSelect,
      onClose,
      options,
      searchTerm,
      setSearchTerm,
      value: [],
      renderOption: (item) =>
        jsxs('div', {
          class: 'gl-flex gl-gap-x-2 gl-py-2',
          children: [
            jsx(GitlabIcon, { icon: 'issue-type-issue', size: 16 }),
            jsx('small', { children: item.iid }),
            jsx('span', {
              class: 'gl-flex gl-flex-wrap',
              children: item.title,
            }),
          ],
        }),
    }),
  });
}

// apps/gitlab-plus/src/services/RelatedIssueAutocomplete.tsx
class RelatedIssueAutocomplete extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.RelatedIssueAutocomplete);
    __publicField(this, 'readyClass', 'glp-input-ready');
  }

  init() {
    this.setup(this.initObserver.bind(this), LinkParser.validateIssueLink);
  }

  initAutocomplete(section) {
    const input = section.querySelector('#add-related-issues-form-input');
    const link = LinkParser.parseIssueLink(window.location.href);
    if (!input || this.isMounted(input) || !link) {
      return;
    }
    const container = input.closest('.add-issuable-form-input-wrapper');
    if (!container || document.querySelector('.related-issues-autocomplete')) {
      return;
    }
    RendererHelper.render(
      'related-issues-autocomplete',
      container,
      jsx(RelatedIssuesAutocompleteModal, { input, link })
    );
  }

  initObserver() {
    const section = document.querySelector('#related-issues');
    if (this.ready || !section) {
      return;
    }
    this.ready = true;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.initAutocomplete(section);
        }
      });
    });
    observer.observe(section, {
      childList: true,
    });
  }

  isMounted(input) {
    return input.classList.contains(this.readyClass);
  }
}

// apps/gitlab-plus/src/services/RelatedIssuesLabelStatus.tsx
class RelatedIssuesLabelStatus extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.RelatedIssuesLabelStatus);
  }

  init() {
    this.setup(this.initIssuesList.bind(this), LinkParser.validateIssueLink);
  }

  initIssuesList() {
    const lists = document.querySelectorAll(
      '#related-issues .related-items-list'
    );
    const link = LinkParser.parseIssueLink(window.location.href);
    if (!lists.length || !link) {
      return;
    }
    this.ready = true;
    const items = [...lists].flatMap((list) => [
      ...list.querySelectorAll('li'),
    ]);
    this.updateIssuesItem(link, items);
  }

  async updateIssuesItem(link, items) {
    const response = await new IssueProvider().getIssueWithRelatedIssuesLabels(
      link.projectPath,
      link.issue
    );
    const issueStatusMap =
      response.data.project.issue.linkedWorkItems.nodes.reduce((acc, value) => {
        return {
          ...acc,
          [value.workItem.id.replace(/\D/g, '')]:
            LabelHelper.getStatusLabelFromWidgets(value.workItem.widgets),
        };
      }, {});
    items.forEach((item) => {
      if (!item.dataset.key || !issueStatusMap[item.dataset.key]) {
        return;
      }
      const statusLabel = issueStatusMap[item.dataset.key];
      const infoArea = item.querySelector('.item-attributes-area');
      if (infoArea && statusLabel) {
        RendererHelper.render(
          'glp-status-label',
          infoArea,
          jsx(GitlabLabel, { label: statusLabel }),
          'prepend'
        );
      }
    });
  }
}

// libs/share/src/ui/Component.ts
class Component {
  constructor(tag, props = {}) {
    this.element = Dom.create({ tag, ...props });
  }

  addClassName(...className) {
    this.element.classList.add(...className);
  }

  event(event, callback) {
    this.element.addEventListener(event, callback);
  }

  getElement() {
    return this.element;
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
}

// libs/share/src/ui/SvgComponent.ts
class SvgComponent {
  constructor(tag, props = {}) {
    this.element = Dom.createSvg({ tag, ...props });
  }

  addClassName(...className) {
    this.element.classList.add(...className);
  }

  event(event, callback) {
    this.element.addEventListener(event, callback);
  }

  getElement() {
    return this.element;
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
}

// libs/share/src/ui/Dom.ts
class Dom {
  static appendChildren(element, children, isSvgMode = false) {
    if (children) {
      element.append(
        ...Dom.array(children).map((item) => {
          if (typeof item === 'string') {
            return document.createTextNode(item);
          }
          if (item instanceof HTMLElement || item instanceof SVGElement) {
            return item;
          }
          if (item instanceof Component || item instanceof SvgComponent) {
            return item.getElement();
          }
          const isSvg =
            'svg' === item.tag
              ? true
              : 'foreignObject' === item.tag
              ? false
              : isSvgMode;
          if (isSvg) {
            return Dom.createSvg(item);
          }
          return Dom.create(item);
        })
      );
    }
  }

  static applyAttrs(element, attrs) {
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (value === void 0 || value === false) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, `${value}`);
        }
      });
    }
  }

  static applyClass(element, classes) {
    if (classes) {
      element.classList.add(...classes.split(' ').filter(Boolean));
    }
  }

  static applyEvents(element, events) {
    if (events) {
      Object.entries(events).forEach(([name2, callback]) => {
        element.addEventListener(name2, callback);
      });
    }
  }

  static applyStyles(element, styles) {
    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        const name2 = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        element.style.setProperty(name2, value);
      });
    }
  }

  static array(element) {
    return Array.isArray(element) ? element : [element];
  }

  static create(data) {
    const element = document.createElement(data.tag);
    Dom.appendChildren(element, data.children);
    Dom.applyClass(element, data.classes);
    Dom.applyAttrs(element, data.attrs);
    Dom.applyEvents(element, data.events);
    Dom.applyStyles(element, data.styles);
    return element;
  }

  static createSvg(data) {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      data.tag
    );
    Dom.appendChildren(element, data.children, true);
    Dom.applyClass(element, data.classes);
    Dom.applyAttrs(element, data.attrs);
    Dom.applyEvents(element, data.events);
    Dom.applyStyles(element, data.styles);
    return element;
  }

  static element(tag, classes, children) {
    return Dom.create({ tag, children, classes });
  }

  static elementSvg(tag, classes, children) {
    return Dom.createSvg({ tag, children, classes });
  }
}

// apps/gitlab-plus/src/services/SortIssue.ts
const sortWeight = {
  ['issue']: 4,
  ['label']: 0,
  ['ownIssue']: 10,
  ['ownUserStory']: 8,
  ['unknown']: 2,
  ['userStory']: 6,
};

class SortIssue extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.SortIssue);
    __publicField(this, 'userName', '');
  }

  init() {
    this.start();
  }

  childType(child) {
    if (child instanceof HTMLDivElement) {
      return 'label';
    }
    const title = child.querySelector('[data-testid="board-card-title-link"]');
    if (!title) {
      return 'unknown';
    }
    const isOwn = [...child.querySelectorAll('.gl-avatar-link img')].some(
      (img) => img.alt.includes(this.userName)
    );
    const isUserStory = [...child.querySelectorAll('.gl-label')].some((span) =>
      span.innerText.includes('User Story')
    );
    if (isUserStory && isOwn) {
      return 'ownUserStory';
    }
    if (isOwn) {
      return 'ownIssue';
    }
    if (isUserStory) {
      return 'userStory';
    }
    return 'issue';
  }

  initBoard(board) {
    Dom.applyClass(board, 'glp-ready');
    const observer = new Observer();
    observer.start(board, () => this.sortBoard(board), {
      childList: true,
    });
  }

  run() {
    [...document.querySelectorAll('.board-list:not(.glp-ready)')].forEach(
      (board) => this.initBoard(board)
    );
  }

  shouldSort(items) {
    return items.some((item) => {
      return ['ownIssue', 'ownUserStory'].includes(item.type);
    });
  }

  sortBoard(board) {
    Dom.applyStyles(board, {
      display: 'flex',
      flexDirection: 'column',
    });
    const children = [...board.children].map((element) => ({
      element,
      type: this.childType(element),
    }));
    if (!this.shouldSort(children)) {
      return;
    }
    this.sortChildren(children).forEach(({ element }, index) => {
      const order =
        index !== children.length - 1 ? index + 1 : children.length + 100;
      element.style.order = `${order}`;
    });
  }

  sortChildren(items) {
    return items.toSorted((a, b) => {
      return Math.sign(sortWeight[b.type] - sortWeight[a.type]);
    });
  }

  async start() {
    const response = await new UsersProvider().getCurrentUser();
    this.userName = response.data.currentUser.username;
    const observer = new Observer();
    const board = document.querySelector('.boards-list');
    if (board) {
      observer.start(board, () => this.run());
    }
  }
}

// apps/gitlab-plus/src/components/user-settings/UserSettingsButton.tsx
function UserSettingsButton() {
  return jsx('span', {
    className: 'gl-new-dropdown-item-content',
    onClick: () =>
      document.dispatchEvent(
        new CustomEvent(ModalEvents.showUserSettingsModal)
      ),
    children: jsxs('span', {
      className: 'gl-new-dropdown-item-text-wrapper',
      children: [
        jsx('span', { style: { color: '#e24329' }, children: 'Gitlab Plus' }),
        ' settings',
      ],
    }),
  });
}

// apps/gitlab-plus/src/components/common/base/Column.tsx
function Column({ children, className, gap, items, justify }) {
  return jsx('div', {
    class: clsx(
      'gl-flex gl-flex-col',
      justify && `gl-justify-${justify}`,
      items && `gl-items-${items}`,
      gap && `gl-gap-${gap}`,
      className
    ),
    children,
  });
}

// apps/gitlab-plus/src/components/common/GitlabSwitch.tsx
function GitlabSwitch({ checked, disabled, onChange }) {
  return jsx('button', {
    'aria-checked': checked,
    'aria-disabled': disabled,
    disabled,
    onClick: () => onChange(!checked),
    role: 'switch',
    type: 'button',
    className: clsx(
      'gl-toggle gl-shrink-0',
      checked && 'is-checked',
      disabled && 'is-disabled'
    ),
    children: jsx('span', {
      className: 'toggle-icon',
      children: jsx(GitlabIcon, { icon: checked ? 'check-xs' : 'close-xs' }),
    }),
  });
}

// apps/gitlab-plus/src/components/user-settings/UserConfigForm.tsx
function UserConfigForm({ setValue, value }) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  return jsx(Row, {
    gap: 2,
    items: 'center',
    justify: 'end',
    children: isEditable
      ? jsxs(Fragment, {
          children: [
            jsx('input', {
              className: clsx('gl-form-input form-control gl-form-input-sm'),
              onInput: (e) => setInputValue(e.target.value),
              value: inputValue,
            }),
            jsx(GitlabButton, {
              className: 'btn-icon',
              icon: 'check-sm',
              iconSize: 16,
              onClick: () => {
                setIsEditable(false);
                setValue(inputValue);
              },
            }),
            jsx(GitlabButton, {
              className: 'btn-icon',
              icon: 'close',
              iconSize: 16,
              onClick: () => {
                setIsEditable(false);
                setInputValue(value);
              },
            }),
          ],
        })
      : jsxs(Fragment, {
          children: [
            jsx(Text, { weight: 'bold', children: value }),
            jsx(GitlabButton, {
              className: 'btn-icon',
              icon: 'pencil',
              iconSize: 16,
              onClick: () => setIsEditable(true),
            }),
          ],
        }),
  });
}

// apps/gitlab-plus/src/components/user-settings/useUserSettingsModal.tsx
function useUserSettingsModal() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const services = useMemo(() => {
    return Object.entries(servicesConfig)
      .map(([name2, config]) => ({
        isActive: Boolean(userSettingsStore.isActive(name2)),
        isExperimental: config.experimental,
        isRequired: config.required,
        label: config.label,
        name: name2,
      }))
      .sort((a, b) => {
        if (a.isRequired || b.isRequired) {
          return a.isRequired ? 1 : -1;
        }
        if (a.isExperimental || b.isExperimental) {
          return a.isExperimental ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
  }, [refreshFlag]);
  const configs = useMemo(() => {
    return Object.values(UserConfig).map((name2) => ({
      label: configLabels[name2],
      name: name2,
      value: userSettingsStore.getConfig(name2),
    }));
  }, [refreshFlag]);
  return {
    configs,
    services,
    setConfig: (name2, value) => {
      userSettingsStore.setConfig(name2, value);
      setRefreshFlag((flag) => !flag);
    },
    setServiceState: (name2, value) => {
      userSettingsStore.setIsActive(name2, value);
      setRefreshFlag((flag) => !flag);
    },
  };
}

// apps/gitlab-plus/src/components/user-settings/UserSettingsModal.tsx
function UserSettingModal() {
  const { isVisible, onClose } = useGlpModal(ModalEvents.showUserSettingsModal);
  const { configs, services, setConfig, setServiceState } =
    useUserSettingsModal();
  return jsx(GlpModal, {
    isVisible,
    onClose,
    title: jsxs(Fragment, {
      children: [
        jsx('span', { style: { color: '#e24329' }, children: 'Gitlab Plus' }),
        ' settings',
      ],
    }),
    children: jsxs(Column, {
      className: 'gl-p-4',
      gap: 2,
      children: [
        configs.map((config) =>
          jsxs(
            Row,
            {
              gap: 2,
              items: 'center',
              justify: 'between',
              children: [
                jsx(Text, { children: config.label }),
                jsx(UserConfigForm, {
                  setValue: (value) => setConfig(config.name, value),
                  value: config.value,
                }),
              ],
            },
            config.name
          )
        ),
        jsx('hr', { class: 'gl-my-2' }),
        services.map((service) =>
          jsxs(Row, {
            gap: 2,
            items: 'center',
            children: [
              jsx(GitlabSwitch, {
                checked: service.isActive,
                disabled: service.isRequired,
                onChange: (value) => setServiceState(service.name, value),
              }),
              jsx(Text, {
                variant: service.isRequired ? 'secondary' : void 0,
                children: service.label,
              }),
              service.isExperimental &&
                jsx(GitlabBadge, { label: 'Experimental', variant: 'warning' }),
              service.isRequired &&
                jsx(GitlabBadge, { label: 'Required', variant: 'muted' }),
            ],
          })
        ),
      ],
    }),
  });
}

// apps/gitlab-plus/src/services/UserSettings.tsx
class UserSettings extends BaseService {
  constructor() {
    super(...arguments);
    __publicField(this, 'name', ServiceName.UserSettings);
  }

  init() {
    this.setup(this.initUserSettings.bind(this));
  }

  getMenuItem() {
    const userMenu = document.querySelector('[data-testid="preferences-item"]');
    if (!userMenu || !userMenu.parentElement) {
      return void 0;
    }
    const li = document.createElement('li');
    li.className = 'gl-new-dropdown-item';
    userMenu.parentElement.append(li);
    return li;
  }

  initUserSettings() {
    const userMenu = this.getMenuItem();
    if (!userMenu) {
      return;
    }
    this.ready = true;
    RendererHelper.renderInNode(userMenu, jsx(UserSettingsButton, {}));
    RendererHelper.renderInBody(
      'glp-user-settings-root',
      jsx(UserSettingModal, {})
    );
  }
}

// apps/gitlab-plus/src/main.ts
[
  ClearCacheService,
  ImagePreview,
  MrPreview,
  EpicPreview,
  IssuePreview,
  CreateRelatedIssue,
  CreateChildIssue,
  RelatedIssueAutocomplete,
  RelatedIssuesLabelStatus,
  SortIssue,
  UserSettings,
  IssueStatus,
  EpicStatus,
].forEach((Service) => {
  const service = new Service();
  if (userSettingsStore.isActive(service.name)) {
    service.init();
  }
});
