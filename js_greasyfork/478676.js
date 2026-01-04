// ==UserScript==
// ==UserLibrary==
// @name        NH_widget
// @description Widgets for user interactions.
// @version     45
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @homepageURL https://github.com/nexushoratio/userscripts
// @supportURL  https://github.com/nexushoratio/userscripts/issues
// @match       https://www.example.com/*
// ==/UserLibrary==
// ==/UserScript==

window.NexusHoratio ??= {};

window.NexusHoratio.widget = (function widget() {
  'use strict';

  /** @type {number} - Bumped per release. */
  const version = 45;

  const NH = window.NexusHoratio.base.ensure([
    {name: 'xunit', minVersion: 39},
    {name: 'base', minVersion: 52},
  ]);

  /** Library specific exception. */
  class Exception extends NH.base.Exception {}

  /** Thrown on verification errors. */
  class VerificationError extends Exception {}

  /** Useful for matching in tests. */
  const HEX = '[0-9a-f]';
  const GUID = `${HEX}{8}-(${HEX}{4}-){3}${HEX}{12}`;

  /** @typedef {(string|HTMLElement|Widget)} Content */

  /**
   * Base class for rendering widgets.
   *
   * Subclasses should NOT override methods here, except for constructor().
   * Instead they should register listeners for appropriate events.
   *
   * Generally, methods will fire two event verbs.  The first, in present
   * tense, will instruct what should happen (build, destroy, etc).  The
   * second, in past tense, will describe what should have happened (built,
   * destroyed, etc).  Typically, subclasses will act upon the present tense,
   * and users of the class may act upon the past tense.
   *
   * Methods should generally be able to be chained.
   *
   * If a variable holding a widget is set to a new value, the previous widget
   * should be explicitly destroyed.
   *
   * When a Widget is instantiated, it should only create a container of the
   * requested type (done in this base class).  And install any widget styles
   * it needs in order to function.  The container property can then be placed
   * into the DOM.
   *
   * If a Widget needs specific CSS to function, that CSS should be shared
   * across all instances of the Widget by using the same values in a call to
   * installStyle().  Anything used for presentation should include the
   * Widget's id as part of the style's id.
   *
   * The build() method will fire 'build'/'built' events.  Subclasses then
   * populate the container with HTML as appropriate.  Widgets should
   * generally be designed to not update the internal HTML until build() is
   * explicitly called.
   *
   * The destroy() method will fire 'destroy'/'destroyed' events and also
   * clear the innerHTML of the container.  Subclasses are responsible for any
   * internal cleanup, such as nested Widgets.
   *
   * The verify() method will fire 'verify'/'verified' events.  Subclasses can
   * handle these to validate any internal structures they need for.  For
   * example, Widgets that have ARIA support can ensure appropriate attributes
   * are in place.  If a Widget fails, it should throw a VerificationError
   * with details.
   */
  class Widget {

    /**
     * Each subclass should take a caller provided name.
     * @param {string} name - Name for this instance.
     * @param {string} element - Type of element to use for the container.
     */
    constructor(name, element) {
      if (new.target === Widget) {
        throw new TypeError('Abstract class; do not instantiate directly.');
      }

      this.#name = `${this.constructor.name} ${name}`;
      this.#id = NH.base.uuId(NH.base.safeId(this.name));
      this.#container = document.createElement(element);
      this.#container.id = `${this.id}-container`;
      this.#dispatcher = new NH.base.Dispatcher(...Widget.#knownEvents);
      this.#logger = new NH.base.Logger(`${this.constructor.name}`);
      this.#visible = true;

      this.installStyle('nh-widget',
        [`.${Widget.classHidden} {display: none}`]);
    }

    /** @type {string} - CSS class applied to hide element. */
    static get classHidden() {
      return 'nh-widget-hidden';
    }

    /** @type {Element} */
    get container() {
      return this.#container;
    }

    /** @type {string} */
    get id() {
      return this.#id;
    }

    /** @type {NH.base.Logger} */
    get logger() {
      return this.#logger;
    }

    /** @type {string} */
    get name() {
      return this.#name;
    }

    /** @type {boolean} */
    get visible() {
      return this.#visible;
    }

    /**
     * Materialize the contents into the container.
     *
     * Each time this is called, the Widget should repopulate the contents.
     * @fires 'build' 'built'
     * @returns {Widget} - This instance, for chaining.
     */
    build() {
      this.#dispatcher.fire('build', this);
      this.#dispatcher.fire('built', this);
      this.verify();
      return this;
    }

    /**
     * Tears down internals.  E.g., any Widget that has other Widgets should
     * call their destroy() method as well.
     * @fires 'destroy' 'destroyed'
     * @returns {Widget} - This instance, for chaining.
     */
    destroy() {
      this.#container.innerHTML = '';
      this.#dispatcher.fire('destroy', this);
      this.#dispatcher.fire('destroyed', this);
      return this;
    }

    /**
     * Shows the Widget by removing a CSS class.
     * @fires 'show' 'showed'
     * @returns {Widget} - This instance, for chaining.
     */
    show() {
      this.verify();
      this.#dispatcher.fire('show', this);
      this.container.classList.remove(Widget.classHidden);
      this.#visible = true;
      this.#dispatcher.fire('showed', this);
      return this;
    }

    /**
     * Hides the Widget by adding a CSS class.
     * @fires 'hide' 'hidden'
     * @returns {Widget} - This instance, for chaining.
     */
    hide() {
      this.#dispatcher.fire('hide', this);
      this.container.classList.add(Widget.classHidden);
      this.#visible = false;
      this.#dispatcher.fire('hidden', this);
      return this;
    }

    /**
     * Verifies a Widget's internal state.
     *
     * For example, a Widget may use this to enforce certain ARIA criteria.
     * @fires 'verify' 'verified'
     * @returns {Widget} - This instance, for chaining.
     */
    verify() {
      this.#dispatcher.fire('verify', this);
      this.#dispatcher.fire('verified', this);
      return this;
    }

    /** Clears the container element. */
    clear() {
      this.logger.log('clear is deprecated');
      this.#container.innerHTML = '';
    }

    /**
     * Attach a function to an eventType.
     * @param {string} eventType - Event type to connect with.
     * @param {NH.base.Dispatcher~Handler} func - Single argument function to
     * call.
     * @returns {Widget} - This instance, for chaining.
     */
    on(eventType, func) {
      this.#dispatcher.on(eventType, func);
      return this;
    }

    /**
     * Remove all instances of a function registered to an eventType.
     * @param {string} eventType - Event type to disconnect from.
     * @param {NH.base.Dispatcher~Handler} func - Function to remove.
     * @returns {Widget} - This instance, for chaining.
     */
    off(eventType, func) {
      this.#dispatcher.off(eventType, func);
      return this;
    }

    /**
     * Helper that sets an attribute to value.
     *
     * If value is null, the attribute is removed.
     * @example
     * w.attrText('aria-label', 'Information about the application.')
     * @param {string} attr - Name of the attribute.
     * @param {?string} value - Value to assign.
     * @returns {Widget} - This instance, for chaining.
     */
    attrText(attr, value) {
      if (value === null) {
        this.container.removeAttribute(attr);
      } else {
        this.container.setAttribute(attr, value);
      }
      return this;
    }

    /**
     * Helper that sets an attribute to space separated {Element} ids.
     *
     * This will collect the appropriate id from each value passed then assign
     * that collection to the attribute.  If any value is null, the everything
     * up to that point will be reset.  If the collection ends up being empty
     * (e.g., no values were passed or the last was null), the attribute will
     * be removed.
     * @param {string} attr - Name of the attribute.
     * @param {?Content} values - Value to assign.
     * @returns {Widget} - This instance, for chaining.
     */
    attrElements(attr, ...values) {
      const strs = [];
      for (const value of values) {
        if (value === null) {
          strs.length = 0;
        } else if (typeof value === 'string' || value instanceof String) {
          strs.push(value);
        } else if (value instanceof HTMLElement) {
          if (value.id) {
            strs.push(value.id);
          }
        } else if (value instanceof Widget) {
          if (value.container.id) {
            strs.push(value.container.id);
          }
        }
      }
      if (strs.length) {
        this.container.setAttribute(attr, strs.join(' '));
      } else {
        this.container.removeAttribute(attr);
      }
      return this;
    }

    /**
     * Install a style if not already present.
     *
     * It will NOT overwrite an existing one.
     * @param {string} id - Base to use for the style id.
     * @param {string[]} rules - CSS rules in 'selector { declarations }'.
     * @returns {HTMLStyleElement} - Resulting <style> element.
     */
    installStyle(id, rules) {
      const me = 'installStyle';
      this.logger.entered(me, id, rules);

      const safeId = `${NH.base.safeId(id)}-style`;
      let style = document.querySelector(`#${safeId}`);
      if (!style) {
        style = document.createElement('style');
        style.id = safeId;
        style.textContent = rules.join('\n');
        document.head.append(style);
      }

      this.logger.leaving(me, style);
      return style;
    }

    static #knownEvents = [
      'build',
      'built',
      'verify',
      'verified',
      'destroy',
      'destroyed',
      'show',
      'showed',
      'hide',
      'hidden',
    ];

    #container
    #dispatcher
    #id
    #logger
    #name
    #visible

  }

  /* eslint-disable require-jsdoc */
  class Test extends Widget {

    constructor() {
      super('test', 'section');
    }

  }
  /* eslint-enable */

  /* eslint-disable max-statements */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class WidgetTestCase extends NH.xunit.TestCase {

    testAbstract() {
      this.assertRaises(TypeError, () => {
        new Widget();
      });
    }

    testProperties() {
      // Assemble
      const w = new Test();

      // Assert
      this.assertTrue(w.container instanceof HTMLElement, 'element');
      this.assertRegExp(
        w.container.id,
        RegExp(`^Test-test-${GUID}-container$`, 'u'),
        'container'
      );

      this.assertRegExp(w.id, RegExp(`^Test-test-${GUID}`, 'u'), 'id');
      this.assertTrue(w.logger instanceof NH.base.Logger, 'logger');
      this.assertEqual(w.name, 'Test test', 'name');
    }

    testSimpleEvents() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const w = new Test()
        .on('build', cb)
        .on('built', cb)
        .on('verify', cb)
        .on('verified', cb)
        .on('destroy', cb)
        .on('destroyed', cb)
        .on('show', cb)
        .on('showed', cb)
        .on('hide', cb)
        .on('hidden', cb);

      // Act
      w.build()
        .show()
        .hide()
        .destroy();

      // Assert
      this.assertEqual(calls, [
        ['build', w],
        ['built', w],
        // After build()
        ['verify', w],
        ['verified', w],
        // Before show()
        ['verify', w],
        ['verified', w],
        ['show', w],
        ['showed', w],
        ['hide', w],
        ['hidden', w],
        ['destroy', w],
        ['destroyed', w],
      ]);
    }

    testDestroyCleans() {
      // Assemble
      const w = new Test();
      // XXX: Broken HTML on purpose
      w.container.innerHTML = '<p>Paragraph<p>';

      this.assertEqual(w.container.innerHTML,
        '<p>Paragraph</p><p></p>',
        'html got fixed');
      this.assertEqual(w.container.children.length, 2, 'initial count');

      // Act
      w.destroy();

      // Assert
      this.assertEqual(w.container.children.length, 0, 'post destroy count');
    }

    testHideShow() {
      // Assemble
      const w = new Test();

      this.assertTrue(w.visible, 'init vis');
      this.assertFalse(w.container.classList.contains(Widget.classHidden),
        'init class');

      w.hide();

      this.assertFalse(w.visible, 'hide vis');
      this.assertTrue(w.container.classList.contains(Widget.classHidden),
        'hide class');

      w.show();

      this.assertTrue(w.visible, 'show viz');
      this.assertFalse(w.container.classList.contains(Widget.classHidden),
        'show class');
    }

    testVerifyFails() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const onVerify = () => {
        throw new VerificationError('oopsie');
      };
      const w = new Test()
        .on('build', cb)
        .on('verify', onVerify)
        .on('show', cb);

      // Act/Assert
      this.assertRaises(
        VerificationError,
        () => {
          w.build()
            .show();
        },
        'verify fails on purpose'
      );
      this.assertEqual(calls, [['build', w]], 'we made it past build');
    }

    testOnOff() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const w = new Test()
        .on('build', cb)
        .on('built', cb)
        .on('destroyed', cb)
        .off('build', cb)
        .on('destroy', cb)
        .off('destroyed', cb);

      // Act
      w.build()
        .hide()
        .show()
        .destroy();

      // Assert
      this.assertEqual(calls, [
        ['built', w],
        ['destroy', w],
      ]);
    }

    testAttrText() {
      // Assemble
      const attr = 'aria-label';
      const w = new Test();

      function f() {
        return w.container.getAttribute(attr);
      }

      this.assertEqual(f(), null, 'init does not exist');

      // First value
      w.attrText(attr, 'App info.');
      this.assertEqual(f(), 'App info.', 'exists');

      // Change
      w.attrText(attr, 'Different value');
      this.assertEqual(f(), 'Different value', 'post change');

      // Empty string
      w.attrText(attr, '');
      this.assertEqual(f(), '', 'empty string');

      // Remove
      w.attrText(attr, null);
      this.assertEqual(f(), null, 'now gone');
    }

    testAttrElements() {
      const attr = 'aria-labelledby';
      const text = 'id1 id2';
      const div = document.createElement('div');
      div.id = 'div-id';
      const w = new Test();
      w.container.id = 'w-id';

      function g() {
        return w.container.getAttribute(attr);
      }

      this.assertEqual(g(), null, 'init does not exist');

      // Single value
      w.attrElements(attr, 'bob');
      this.assertEqual(g(), 'bob', 'single value');

      // Replace with spaces
      w.attrElements(attr, text);
      this.assertEqual(g(), 'id1 id2', 'spaces');

      // Remove
      w.attrElements(attr, null);
      this.assertEqual(g(), null, 'first remove');

      // Multiple values of different types
      w.attrElements(attr, text, div, w);
      this.assertEqual(g(), 'id1 id2 div-id w-id', 'everything');

      // Duplicates
      w.attrElements(attr, text, text);
      this.assertEqual(g(), 'id1 id2 id1 id2', 'duplicates');

      // Null in the middle
      w.attrElements(attr, w, null, text, null, text);
      this.assertEqual(g(), 'id1 id2', 'mid null');

      // Null at the end
      w.attrElements(attr, text, w, div, null);
      this.assertEqual(g(), null, 'end null');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(WidgetTestCase);

  /**
   * An adapter for raw HTML.
   *
   * Other Widgets may use this to wrap any HTML they may be handed so they do
   * not need to special case their implementation outside of construction.
   */
  class StringAdapter extends Widget {

    /**
     * @param {string} name - Name for this instance.
     * @param {string} content - Item to be adapted.
     */
    constructor(name, content) {
      super(name, 'content');
      this.#content = content;
      this.on('build', this.#onBuild);
    }

    #content

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      this.container.innerHTML = this.#content;

      this.logger.leaving(me);
    }

  }

  /* eslint-disable no-new-wrappers */
  /* eslint-disable require-jsdoc */
  class StringAdapterTestCase extends NH.xunit.TestCase {

    testPrimitiveString() {
      // Assemble
      let p = '<p id="bob">This is my paragraph.</p>';
      const content = new StringAdapter(this.id, p);

      // Act
      content.build();

      // Assert
      this.assertTrue(content.container instanceof HTMLUnknownElement,
        'is HTMLUnknownElement');
      this.assertTrue((/my paragraph./u).test(content.container.innerText),
        'expected text');
      this.assertEqual(content.container.firstChild.tagName, 'P', 'is para');
      this.assertEqual(content.container.firstChild.id, 'bob', 'is bob');

      // Tweak
      content.container.firstChild.id = 'joe';
      this.assertNotEqual(content.container.firstChild.id, 'bob', 'not bob');

      // Rebuild
      content.build();
      this.assertEqual(content.container.firstChild.id, 'bob', 'bob again');

      // Tweak - Not a live string
      p = '<p id="changed">New para.</p>';
      this.assertEqual(content.container.firstChild.id, 'bob', 'still bob');
    }

    testStringObject() {
      // Assemble
      const p = new String('<p id="pat">This is my paragraph.</p>');
      const content = new StringAdapter(this.id, p);

      // Act
      content.build();
      // Assert
      this.assertTrue(content.container instanceof HTMLUnknownElement,
        'is HTMLUnknownElement');
      this.assertTrue((/my paragraph./u).test(content.container.innerText),
        'expected text');
      this.assertEqual(content.container.firstChild.tagName, 'P', 'is para');
      this.assertEqual(content.container.firstChild.id, 'pat', 'is pat');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(StringAdapterTestCase);

  /**
   * An adapter for HTMLElement.
   *
   * Other Widgets may use this to wrap any HTMLElements they may be handed so
   * they do not need to special case their implementation outside of
   * construction.
   */
  class ElementAdapter extends Widget {

    /**
     * @param {string} name - Name for this instance.
     * @param {HTMLElement} content - Item to be adapted.
     */
    constructor(name, content) {
      super(name, 'content');
      this.#content = content;
      this.on('build', this.#onBuild);
    }

    #content

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      this.container.replaceChildren(this.#content);

      this.logger.leaving(me);
    }

  }
  /* eslint-disable require-jsdoc */
  class ElementAdapterTestCase extends NH.xunit.TestCase {

    testElement() {
      // Assemble
      const div = document.createElement('div');
      div.id = 'pat';
      div.innerText = 'I am a div.';
      const content = new ElementAdapter(this.id, div);

      // Act
      content.build();

      // Assert
      this.assertTrue(content.container instanceof HTMLUnknownElement,
        'is HTMLUnknownElement');
      this.assertTrue((/I am a div./u).test(content.container.innerText),
        'expected text');
      this.assertEqual(content.container.firstChild.tagName, 'DIV', 'is div');
      this.assertEqual(content.container.firstChild.id, 'pat', 'is pat');

      // Tweak
      content.container.firstChild.id = 'joe';
      this.assertNotEqual(content.container.firstChild.id, 'pat', 'not pat');
      this.assertEqual(div.id, 'joe', 'demos is a live element');

      // Rebuild
      content.build();
      this.assertEqual(content.container.firstChild.id, 'joe', 'still joe');

      // Multiple times
      content.build();
      content.build();
      content.build();
      this.assertEqual(content.container.childNodes.length, 1, 'child nodes');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ElementAdapterTestCase);

  /**
   * Selects the best adapter to wrap the content.
   * @param {string} name - Name for this instance.
   * @param {Content} content - Content to be adapted.
   * @throws {TypeError} - On type not handled.
   * @returns {Widget} - Appropriate adapter for content.
   */
  function contentWrapper(name, content) {
    if (typeof content === 'string' || content instanceof String) {
      return new StringAdapter(name, content);
    } else if (content instanceof HTMLElement) {
      return new ElementAdapter(name, content);
    } else if (content instanceof Widget) {
      return content;
    }
    throw new TypeError(`Unknown type for "${name}": ${content}`);
  }

  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-new-wrappers */
  /* eslint-disable require-jsdoc */
  class ContentWrapperTestCase extends NH.xunit.TestCase {

    testPrimitiveString() {
      const x = contentWrapper(this.id, 'a string');

      this.assertTrue(x instanceof StringAdapter);
    }

    testStringObject() {
      const x = contentWrapper(this.id, new String('a string'));

      this.assertTrue(x instanceof StringAdapter);
    }

    testElement() {
      const element = document.createElement('div');
      const x = contentWrapper(this.id, element);

      this.assertTrue(x instanceof ElementAdapter);
    }

    testWidget() {
      const t = new Test();
      const x = contentWrapper(this.id, t);

      this.assertEqual(x, t);
    }

    testUnknown() {
      this.assertRaises(
        TypeError,
        () => {
          contentWrapper(this.id, null);
        },
        'null'
      );

      this.assertRaises(
        TypeError,
        () => {
          contentWrapper(this.id, 5);
        },
        'int'
      );

      this.assertRaises(
        TypeError,
        () => {
          contentWrapper(this.id, new Error('why not?'));
        },
        'error-type'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ContentWrapperTestCase);

  /**
   * Implements the Layout pattern.
   */
  class Layout extends Widget {

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'div');
      this.on('build', this.#onBuild)
        .on('destroy', this.#onDestroy);
      for (const panel of Layout.#Panel.known) {
        this.set(panel, '');
      }
    }

    /** @type {Widget} */
    get bottom() {
      return this.#panels.get(Layout.BOTTOM);
    }

    /** @type {Widget} */
    get left() {
      return this.#panels.get(Layout.LEFT);
    }

    /** @type {Widget} */
    get main() {
      return this.#panels.get(Layout.MAIN);
    }

    /** @type {Widget} */
    get right() {
      return this.#panels.get(Layout.RIGHT);
    }

    /** @type {Widget} */
    get top() {
      return this.#panels.get(Layout.TOP);
    }

    /**
     * Sets a panel for this instance.
     *
     * @param {Layout.#Panel} panel - Panel to set.
     * @param {Content} content - Content to use.
     * @returns {Widget} - This instance, for chaining.
     */
    set(panel, content) {
      if (!(panel instanceof Layout.#Panel)) {
        throw new TypeError('"panel" argument is not a Layout.#Panel');
      }

      this.#panels.get(panel)
        ?.destroy();

      this.#panels.set(panel,
        contentWrapper(`${panel} panel content`, content));

      return this;
    }

    /** Panel enum. */
    static #Panel = class {

      /** @param {string} name - Panel name. */
      constructor(name) {
        this.#name = name;

        Layout.#Panel.known.add(this);
      }

      static known = new Set();

      /** @returns {string} - The name. */
      toString() {
        return this.#name;
      }

      #name

    }

    static {
      Layout.BOTTOM = new Layout.#Panel('bottom');
      Layout.LEFT = new Layout.#Panel('left');
      Layout.MAIN = new Layout.#Panel('main');
      Layout.RIGHT = new Layout.#Panel('right');
      Layout.TOP = new Layout.#Panel('top');
    }

    #panels = new Map();

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      for (const panel of this.#panels.values()) {
        panel.build();
      }

      const middle = document.createElement('div');
      middle.append(
        this.left.container, this.main.container, this.right.container
      );
      this.container.replaceChildren(
        this.top.container, middle, this.bottom.container
      );

      this.logger.leaving(me);
    }

    #onDestroy = (...rest) => {
      const me = 'onDestroy';
      this.logger.entered(me, rest);

      for (const panel of this.#panels.values()) {
        panel.destroy();
      }
      this.#panels.clear();

      this.logger.leaving(me);
    }

  }

  /* eslint-disable require-jsdoc */
  /* eslint-disable no-undefined */
  class LayoutTestCase extends NH.xunit.TestCase {

    testIsDiv() {
      // Assemble
      const w = new Layout(this.id);

      // Assert
      this.assertEqual(w.container.tagName, 'DIV', 'correct element');
    }

    testPanelsStartSimple() {
      // Assemble
      const w = new Layout(this.id);

      // Assert
      this.assertTrue(w.main instanceof Widget, 'main');
      this.assertRegExp(w.main.name, / main panel content/u, 'main name');
      this.assertTrue(w.top instanceof Widget, 'top');
      this.assertRegExp(w.top.name, / top panel content/u, 'top name');
      this.assertTrue(w.bottom instanceof Widget, 'bottom');
      this.assertTrue(w.left instanceof Widget, 'left');
      this.assertTrue(w.right instanceof Widget, 'right');
    }

    testSetWorks() {
      // Assemble
      const w = new Layout(this.id);

      // Act
      w.set(Layout.MAIN, 'main')
        .set(Layout.TOP, document.createElement('div'));

      // Assert
      this.assertTrue(w.main instanceof Widget, 'main');
      this.assertEqual(
        w.main.name, 'StringAdapter main panel content', 'main name'
      );
      this.assertTrue(w.top instanceof Widget, 'top');
      this.assertEqual(
        w.top.name, 'ElementAdapter top panel content', 'top name'
      );
    }

    testSetRequiresPanel() {
      // Assemble
      const w = new Layout(this.id);

      // Act/Assert
      this.assertRaises(
        TypeError,
        () => {
          w.set('main', 'main');
        }
      );
    }

    testDefaultBuilds() {
      // Assemble
      const w = new Layout(this.id);

      // Act
      w.build();

      // Assert
      const expected = [
        '<content.*-top-panel-.*></content>',
        '<div>',
        '<content.*-left-panel-.*></content>',
        '<content.*-main-panel-.*></content>',
        '<content.*-right-panel-.*></content>',
        '</div>',
        '<content.*-bottom-panel-.*></content>',
      ].join('');
      this.assertRegExp(w.container.innerHTML, RegExp(expected, 'u'));
    }

    testWithContentBuilds() {
      // Assemble
      const w = new Layout(this.id);
      w.set(Layout.MAIN, 'main')
        .set(Layout.TOP, 'top')
        .set(Layout.BOTTOM, 'bottom')
        .set(Layout.RIGHT, 'right')
        .set(Layout.LEFT, 'left');

      // Act
      w.build();

      // Assert
      this.assertEqual(w.container.innerText, 'topleftmainrightbottom');
    }

    testResetingPanelDestroysPrevious() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const w = new Layout(this.id);
      const initMain = w.main;
      initMain.on('destroy', cb);
      const newMain = contentWrapper(this.id, 'Replacement main');

      // Act
      w.set(Layout.MAIN, newMain);
      w.build();

      // Assert
      this.assertEqual(calls, [['destroy', initMain]], 'old main destroyed');
      this.assertEqual(
        w.container.innerText, 'Replacement main', 'new content'
      );
    }

    testDestroy() {
      // Assemble
      const calls = [];
      const cb = (evt) => {
        calls.push(evt);
      };
      const w = new Layout(this.id)
        .set(Layout.MAIN, 'main')
        .build();

      w.top.on('destroy', cb);
      w.left.on('destroy', cb);
      w.main.on('destroy', cb);
      w.right.on('destroy', cb);
      w.bottom.on('destroy', cb);

      this.assertEqual(w.container.innerText, 'main', 'sanity check');

      // Act
      w.destroy();

      // Assert
      this.assertEqual(w.container.innerText, '', 'post destroy inner');
      this.assertEqual(w.main, undefined, 'post destroy main');
      this.assertEqual(
        calls,
        ['destroy', 'destroy', 'destroy', 'destroy', 'destroy'],
        'each panel was destroyed'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(LayoutTestCase);

  /**
   * Arbitrary object to be used as data for {@link Grid}.
   * @typedef {object} GridRecord
   */

  /** Column for the {@link Grid} widget. */
  class GridColumn {

    /**
     * @callback ColumnClassesFunc
     * @param {GridRecord} record - Record to style.
     * @param {string} field - Field to style.
     * @returns {string[]} - CSS classes for item.
     */

    /**
     * @callback RenderFunc
     * @param {GridRecord} record - Record to render.
     * @param {string} field - Field to render.
     * @returns {Widget} - Rendered content.
     */

    /** @param {string} field - Which field to render by default. */
    constructor(field) {
      if (!field) {
        throw new Exception('A "field" is required');
      }
      this.#field = field;
      this.#uid = NH.base.uuId(this.constructor.name);
      this.colClassesFunc()
        .renderFunc()
        .setTitle();
    }

    /**
     * The default implementation uses the field.
     *
     * @implements {ColumnClassesFunc}
     * @param {GridRecord} record - Record to style.
     * @param {string} field - Field to style.
     * @returns {string[]} - CSS classes for item.
     */
    static defaultClassesFunc = (record, field) => {
      const result = [field];
      return result;
    }

    /**
     * @implements {RenderFunc}
     * @param {GridRecord} record - Record to render.
     * @param {string} field - Field to render.
     * @returns {Widget} - Rendered content.
     */
    static defaultRenderFunc = (record, field) => {
      const result = contentWrapper(field, record[field]);
      return result;
    }

    /** @type {string} - The name of the property from the record to show. */
    get field() {
      return this.#field;
    }

    /** @type {string} - A human readable value to use in the header. */
    get title() {
      return this.#title;
    }

    /** @type {string} */
    get uid() {
      return this.#uid;
    }

    /**
     * Use the registered rendering function to create the widget.
     *
     * @param {GridRecord} record - Record to render.
     * @returns {Widget} - Rendered content.
     */
    render(record) {
      return contentWrapper(
        this.#field, this.#renderFunc(record, this.#field)
      );
    }

    /**
     * Use the registered {ColClassesFunc} to return CSS classes.
     *
     * @param {GridRecord} record - Record to examine.
     * @returns {string[]} - CSS classes for this record.
     */
    classList(record) {
      return this.#colClassesFunc(record, this.#field);
    }

    /**
     * Sets the function used to style a cell.
     *
     * If no value is passed, it will set the default function.
     *
     * @param {ColClassesFunc} func - Styling function.
     * @returns {GridColumn} - This instance, for chaining.
     */
    colClassesFunc(func = GridColumn.defaultClassesFunc) {
      if (!(func instanceof Function)) {
        throw new Exception(
          'Invalid argument: is not a function'
        );
      }
      this.#colClassesFunc = func;
      return this;
    }

    /**
     * Sets the function used to render the column.
     *
     * If no value is passed, it will set the default function.
     *
     * @param {RenderFunc} [func] - Rendering function.
     * @returns {GridColumn} - This instance, for chaining.
     */
    renderFunc(func = GridColumn.defaultRenderFunc) {
      if (!(func instanceof Function)) {
        throw new Exception(
          'Invalid argument: is not a function'
        );
      }
      this.#renderFunc = func;
      return this;
    }

    /**
     * Set the title string.
     *
     * If no value is passed, it will default back to the name of the field.
     *
     * @param {string} [title] - New title for the column.
     * @returns {GridColumn} - This instance, for chaining.
     */
    setTitle(title) {
      this.#title = title ?? NH.base.simpleParseWords(this.#field)
        .join(' ');
      return this;
    }

    #colClassesFunc
    #field
    #renderFunc
    #title
    #uid

  }

  /* eslint-disable no-empty-function */
  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class GridColumnTestCase extends NH.xunit.TestCase {

    testNoArgment() {
      this.assertRaisesRegExp(
        Exception,
        /A "field" is required/u,
        () => {
          new GridColumn();
        }
      );
    }

    testWithFieldName() {
      // Assemble
      const col = new GridColumn('fieldName');

      // Assert
      this.assertEqual(col.field, 'fieldName');
    }

    testBadRenderFunc() {
      this.assertRaisesRegExp(
        Exception,
        /Invalid argument: is not a function/u,
        () => {
          new GridColumn('testField')
            .renderFunc('string');
        }
      );
    }

    testGoodRenderFunc() {
      this.assertNoRaises(
        () => {
          new GridColumn('fiend')
            .renderFunc(() => {});
        }
      );
    }

    testExplicitTitle() {
      // Assemble
      const col = new GridColumn('fieldName')
        .setTitle('Col Title');

      // Assert
      this.assertEqual(col.title, 'Col Title');
    }

    testDefaultTitle() {
      // Assemble
      const col = new GridColumn('fieldName');

      // Assert
      this.assertEqual(col.title, 'field Name');
    }

    testUid() {
      // Assemble
      const col = new GridColumn(this.id);

      // Assert
      this.assertRegExp(col.uid, /^GridColumn-/u);
    }

    testDefaultRenderer() {
      // Assemble
      const col = new GridColumn('name');
      const record = {name: 'Bob', job: 'Artist'};

      // Act
      const w = col.render(record);

      // Assert
      this.assertTrue(w instanceof Widget, 'correct type');
      this.assertEqual(w.build().container.innerHTML, 'Bob', 'right content');
    }

    testCanSetRenderFunc() {
      // Assemble
      function renderFunc(record, field) {
        return contentWrapper(
          this.id, `${record.name}|${record.job}|${field}`
        );
      }

      const col = new GridColumn('name');
      const record = {name: 'Bob', job: 'Artist'};

      // Act I - Default
      this.assertEqual(
        col.render(record)
          .build().container.innerHTML,
        'Bob',
        'default func'
      );

      // Act II - Custom
      this.assertEqual(
        col.renderFunc(renderFunc)
          .render(record)
          .build().container.innerHTML,
        'Bob|Artist|name',
        'custom func'
      );

      // Act III - Back to default
      this.assertEqual(
        col.renderFunc()
          .render(record)
          .build().container.innerHTML,
        'Bob',
        'back to default'
      );
    }

    testRenderAlwaysReturnsWidget() {
      // Assemble
      function renderFunc(record, field) {
        return `${record.name}|${record.job}|${field}`;
      }

      const col = new GridColumn('name')
        .renderFunc(renderFunc);
      const record = {name: 'Bob', job: 'Artist'};

      // Act
      const w = col.render(record);

      // Assert
      this.assertTrue(w instanceof Widget);
    }

    testDefaultClassesFunc() {
      // Assemble
      const col = new GridColumn('name');
      const record = {name: 'Bob', job: 'Artist'};

      // Act
      const cl = col.classList(record);

      // Assert
      this.assertTrue(cl.includes('name'));
    }

    testCanSetClassesFunc() {
      // Assemble
      function colClassesFunc(record, field) {
        return [`my-${field}`, 'xyzzy'];
      }
      const col = new GridColumn('name');
      const record = {name: 'Bob', job: 'Artist'};

      // Act I - Default
      let cl = col.classList(record);

      // Assert
      this.assertTrue(cl.includes('name'), 'default func has field');
      this.assertFalse(cl.includes('xyzzy'), 'no magic');

      // Act II - Custom
      col.colClassesFunc(colClassesFunc);
      cl = col.classList(record);

      // Assert
      this.assertTrue(cl.includes('my-name'), 'custom has field');
      this.assertTrue(cl.includes('xyzzy'), 'plays adventure');

      // Act III - Back to default
      col.colClassesFunc();
      cl = col.classList(record);

      // Assert
      this.assertTrue(cl.includes('name'), 'back to default');
      this.assertFalse(cl.includes('xyzzy'), 'no more magic');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(GridColumnTestCase);

  /**
   * Implements the Grid pattern.
   *
   * Grid widgets will need `aria-*` attributes, TBD.
   *
   * A Grid consist of defined columns and data.
   *
   * The data is an array of objects that the caller can manipulate as needed,
   * such as adding/removing/updating items, sorting, etc.
   *
   * The columns is an array of {@link GridColumn}s that the caller can
   * manipulate as needed.
   *
   * Row based CSS classes can be controlled by setting a {Grid~ClassFunc}
   * using the rowClassesFunc() method.
   */
  class Grid extends Widget {

    /**
     * @callback RowClassesFunc
     * @param {GridRecord} record - Record to style.
     * @returns {string[]} - CSS classes to add to row.
     */

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'table');
      this.on('build', this.#onBuild)
        .on('destroy', this.#onDestroy)
        .rowClassesFunc();
    }

    /**
     * The default implementation sets no classes.
     *
     * @implements {RowClassesFunc}
     * @returns {string[]} - CSS classes to add to row.
     */
    static defaultClassesFunc = () => {
      const result = [];
      return result;
    }

    /** @type {GridColumns[]} - Column definitions for the Grid. */
    get columns() {
      return this.#columns;
    }

    /** @type {object[]} - Data used by the Grid. */
    get data() {
      return this.#data;
    }

    /**
     * @param {object[]} array - Data used by the Grid.
     * @returns {Grid} - This instance, for chaining.
     */
    set(array) {
      this.#data = array;
      return this;
    }

    /**
     * Sets the function used to style a row.
     *
     * If no value is passed, it will set the default function.
     *
     * @param {RowClassesFunc} func - Styling function.
     * @returns {Grid} - This instance, for chaining.
     */
    rowClassesFunc(func = Grid.defaultClassesFunc) {
      if (!(func instanceof Function)) {
        throw new Exception(
          'Invalid argument: is not a function'
        );
      }
      this.#rowClassesFunc = func;
      return this;
    }

    #built = [];
    #columns = [];
    #data = [];
    #rowClassesFunc;
    #tbody
    #thead

    #resetBuilt = () => {
      for (const row of this.#built) {
        for (const cell of row.cells) {
          cell.widget.destroy();
        }
      }

      this.#built.length = 0;
    }

    #resetContainer = () => {
      this.container.innerHTML = '';
      this.#thead = document.createElement('thead');
      this.#tbody = document.createElement('tbody');
      this.container.append(this.#thead, this.#tbody);
    }

    #populateBuilt = () => {
      for (const row of this.#data) {
        const built = {
          classes: this.#rowClassesFunc(row),
          cells: [],
        };
        for (const col of this.#columns) {
          built.cells.push(
            {
              widget: col.render(row),
              classes: col.classList(row),
            }
          );
        }
        this.#built.push(built);
      }
    }

    #buildHeader = () => {
      const tr = document.createElement('tr');
      for (const col of this.#columns) {
        const th = document.createElement('th');
        th.append(col.title);
        tr.append(th);
      }
      this.#thead.append(tr);
    }

    #buildRows = () => {
      for (const row of this.#built) {
        const tr = document.createElement('tr');
        tr.classList.add(...row.classes);
        for (const cell of row.cells) {
          const td = document.createElement('td');
          td.append(cell.widget.build().container);
          td.classList.add(...cell.classes);
          tr.append(td);
        }
        this.#tbody.append(tr);
      }
    }

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      this.#resetBuilt();
      this.#resetContainer();
      this.#populateBuilt();
      this.#buildHeader();
      this.#buildRows();

      this.logger.leaving(me);
    }

    #onDestroy = (...rest) => {
      const me = 'onDestroy';
      this.logger.entered(me, rest);

      this.#resetBuilt();

      this.logger.leaving(me);
    }

  }

  /* eslint-disable max-lines-per-function */
  /* eslint-disable require-jsdoc */
  class GridTestCase extends NH.xunit.TestCase {

    testDefaults() {
      // Assemble
      const w = new Grid(this.id);

      // Assert
      this.assertEqual(w.container.tagName, 'TABLE', 'correct element');
      this.assertEqual(w.columns, [], 'default columns');
      this.assertEqual(w.data, [], 'default data');
    }

    testColumnsAreLive() {
      // Assemble
      const w = new Grid(this.id);
      const col = new GridColumn('fieldName');

      // Act
      w.columns.push(col, 1);

      // Assert
      this.assertEqual(w.columns, [col, 1], 'note lack of sanity checking');
    }

    testSetUpdatesData() {
      // Assemble
      const w = new Grid(this.id);

      // Act
      w.set([{id: 1, name: 'Sally'}]);

      // Assert
      this.assertEqual(w.data, [{id: 1, name: 'Sally'}]);
    }

    testBadRowClasses() {
      this.assertRaisesRegExp(
        Exception,
        /Invalid argument: is not a function/u,
        () => {
          new Grid(this.id)
            .rowClassesFunc('string');
        }
      );
    }

    testDataIsLive() {
      // Assemble
      const w = new Grid(this.id);
      const data = [{id: 1, name: 'Sally'}];
      w.set(data);

      // Act I - More
      data.push({id: 2, name: 'Jane'}, {id: 3, name: 'Puff'});

      // Assert
      this.assertEqual(
        w.data,
        [
          {id: 1, name: 'Sally'},
          {id: 2, name: 'Jane'},
          {id: 3, name: 'Puff'},
        ],
        'new data was added'
      );

      // Act II - Sort
      data.sort((a, b) => a.name.localeCompare(b.name));

      // Assert
      this.assertEqual(
        w.data,
        [
          {name: 'Jane', id: 2},
          {name: 'Puff', id: 3},
          {name: 'Sally', id: 1},
        ],
        'data was sorted'
      );
    }

    testEmptyBuild() {
      // Assemble
      const w = new Grid(this.id);

      // Act
      w.build();

      // Assert
      const expected = [
        `<table id="Grid-[^-]*-${GUID}[^"]*">`,
        '<thead><tr></tr></thead>',
        '<tbody></tbody>',
        '</table>',
      ].join('');
      this.assertRegExp(w.container.outerHTML, RegExp(expected, 'u'));
    }

    testBuildWithData() {
      // Assemble
      function renderInt(record, field) {
        const span = document.createElement('span');
        span.append(record[field]);
        return span;
      }
      function renderType(record) {
        return `${record.stage}, ${record.species}`;
      }

      const w = new Grid(this.id);
      const data = [
        {id: 1, name: 'Sally', species: 'human', stage: 'juvenile'},
        {name: 'Jane', id: 2, species: 'human', stage: 'juvenile'},
        {name: 'Puff', id: 3, species: 'feline', stage: 'juvenile'},
      ];
      w.set(data);
      w.columns.push(
        new GridColumn('id')
          .renderFunc(renderInt),
        new GridColumn('name'),
        new GridColumn('typ')
          .setTitle('Type')
          .renderFunc(renderType),
      );

      // Act I - First build
      w.build();

      // Assert
      const expected = [
        '<table id="Grid-[^"]*">',
        '<thead>',
        '<tr><th>id</th><th>name</th><th>Type</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr class="">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>1</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Sally',
        '</content></td>',

        `<td class="typ"><content id="StringAdapter-typ-${GUID}-container">`,
        'juvenile, human',
        '</content></td>',

        '</tr>',
        '<tr class="">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>2</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Jane',
        '</content></td>',

        `<td class="typ"><content id="StringAdapter-typ-${GUID}-container">`,
        'juvenile, human',
        '</content></td>',

        '</tr>',
        '<tr class="">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>3</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Puff',
        '</content></td>',

        `<td class="typ"><content id="StringAdapter-typ-${GUID}-container">`,
        'juvenile, feline',
        '</content></td>',

        '</tr>',
        '</tbody>',
        '</table>',
      ].join('');
      this.assertRegExp(
        w.container.outerHTML,
        RegExp(expected, 'u'),
        'first build'
      );

      // Act II - Rebuild is sensible
      w.build();
      this.assertRegExp(
        w.container.outerHTML,
        RegExp(expected, 'u'),
        'second build'
      );
    }

    testBuildWithClasses() {
      // Assemble
      function renderInt(record, field) {
        const span = document.createElement('span');
        span.append(record[field]);
        return span;
      }
      function renderType(record) {
        return `${record.stage}, ${record.species}`;
      }
      function rowClassesFunc(record) {
        return [record.species, record.stage];
      }

      const data = [
        {id: 1, name: 'Sally', species: 'human', stage: 'juvenile'},
        {name: 'Puff', id: 3, species: 'feline', stage: 'juvenile'},
        {name: 'Bob', id: 4, species: 'alien', stage: 'adolescent'},
      ];
      const w = new Grid(this.id)
        .set(data)
        .rowClassesFunc(rowClassesFunc);
      w.columns.push(
        new GridColumn('id')
          .renderFunc(renderInt),
        new GridColumn('name'),
        new GridColumn('tpe')
          .setTitle('Type')
          .renderFunc(renderType),
      );

      // Act
      w.build();

      // Assert
      const expected = [
        '<table id="Grid-[^"]*">',
        '<thead>',
        '<tr><th>id</th><th>name</th><th>Type</th></tr>',
        '</thead>',
        '<tbody>',
        '<tr class="human juvenile">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>1</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Sally',
        '</content></td>',

        `<td class="tpe"><content id="StringAdapter-tpe-${GUID}-container">`,
        'juvenile, human',
        '</content></td>',

        '</tr>',
        '<tr class="feline juvenile">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>3</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Puff',
        '</content></td>',

        `<td class="tpe"><content id="StringAdapter-tpe-${GUID}-container">`,
        'juvenile, feline',
        '</content></td>',

        '</tr>',
        '<tr class="alien adolescent">',

        `<td class="id"><content id="ElementAdapter-id-${GUID}-container">`,
        '<span>4</span>',
        '</content></td>',

        '<td class="name"><content id="StringAdapter-name-.*-container">',
        'Bob',
        '</content></td>',

        `<td class="tpe"><content id="StringAdapter-tpe-${GUID}-container">`,
        'adolescent, alien',
        '</content></td>',

        '</tr>',
        '</tbody>',
        '</table>',
      ].join('');
      this.assertRegExp(
        w.container.outerHTML,
        RegExp(expected, 'u'),
      );
    }

    testRebuildDestroys() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const item = contentWrapper(this.id, 'My data.')
        .on('destroy', cb);
      const w = new Grid(this.id);
      w.data.push({item: item});
      w.columns.push(new GridColumn('item'));

      // Act
      w.build()
        .build();

      // Assert
      this.assertEqual(calls, [['destroy', item]]);
    }

    testDestroy() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const item = contentWrapper(this.id, 'My data.')
        .on('destroy', cb);
      const w = new Grid(this.id);
      w.data.push({item: item});
      w.columns.push(new GridColumn('item'));

      // Act
      w.build()
        .destroy();

      // Assert
      this.assertEqual(calls, [['destroy', item]]);
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(GridTestCase);

  /** Tab for the {@link Tabs} widget. */
  class TabEntry {

    /**
     * @callback LabelClassesFunc
     * @param {string} label - Label to style.
     * @returns {string[]} - CSS classes for item.
     */

    /** @param {string} label - The label for this entry. */
    constructor(label) {
      if (!label) {
        throw new Exception('A "label" is required');
      }
      this.#label = label;
      this.#uid = NH.base.uuId(this.constructor.name);
      this.labelClassesFunc()
        .set();
    }

    /**
     * The default implementation uses the label.
     *
     * @implements {LabelClassesFunc}
     * @param {string} label - Label to style.
     * @returns {string[]} - CSS classes for item.
     */
    static defaultClassesFunc(label) {
      const result = [NH.base.safeId(label)];
      return result;
    }

    /** @type {string} */
    get label() {
      return this.#label;
    }

    /** @type {Widget} */
    get panel() {
      return this.#panel;
    }

    /** @type {string} */
    get uid() {
      return this.#uid;
    }

    /**
     * Use the registered {LabelClassesFunc} to return CSS classes.
     *
     * @returns {string[]} - CSS classes for this record.
     */
    classList() {
      return this.#labelClassesFunc(this.#label);
    }

    /**
     * Sets the function used to style the label.
     *
     * If no value is passed, it will set the default function.
     *
     * @param {LabelClassesFunc} func - Styling function.
     * @returns {TabEntry} - This instance, for chaining.
     */
    labelClassesFunc(func = TabEntry.defaultClassesFunc) {
      if (!(func instanceof Function)) {
        throw new Exception(
          'Invalid argument: is not a function'
        );
      }
      this.#labelClassesFunc = func;
      return this;
    }

    /**
     * Set the panel content for this entry.
     *
     * If no value is passed, defaults to an empty string.
     * @param {Content} [panel] - Panel content.
     * @returns {TabEntry} - This instance, for chaining.
     */
    set(panel = '') {
      this.#panel = contentWrapper('panel content', panel);
      return this;
    }

    #label
    #labelClassesFunc
    #panel
    #uid

  }

  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class TabEntryTestCase extends NH.xunit.TestCase {

    testNoArgument() {
      this.assertRaisesRegExp(
        Exception,
        /A "label" is required/u,
        () => {
          new TabEntry();
        }
      );
    }

    testWithLabel() {
      // Assemble
      const entry = new TabEntry(this.id);

      this.assertEqual(entry.label, this.id);
    }

    testUid() {
      // Assemble
      const entry = new TabEntry(this.id);

      // Assert
      this.assertRegExp(entry.uid, RegExp(`^TabEntry-${GUID}`, 'u'));
    }

    testDefaultClassesFunc() {
      // Assemble
      const entry = new TabEntry('Tab Entry');

      // Assert
      this.assertEqual(entry.classList(), ['Tab-Entry']);
    }

    testCanSetClassesFunc() {
      // Assemble
      function labelClassesFunc(label) {
        return [`my-${label}`, 'abc123'];
      }
      const entry = new TabEntry('tab-entry');

      // Act I - Default
      let cl = entry.classList();

      // Assert
      this.assertTrue(cl.includes('tab-entry'), 'default func has label');
      this.assertFalse(cl.includes('abc123'), 'no alnum');

      // Act II - Custom
      entry.labelClassesFunc(labelClassesFunc);
      cl = entry.classList();

      // Assert
      this.assertTrue(cl.includes('my-tab-entry'), 'custom func is custom');
      this.assertTrue(cl.includes('abc123'), 'has alnum');

      // Act III - Back to default
      entry.labelClassesFunc();
      cl = entry.classList();

      // Assert
      this.assertTrue(cl.includes('tab-entry'), 'default func back to label');
      this.assertFalse(cl.includes('abc123'), 'no more alnum');
    }

    testPanel() {
      // Assemble/Act I - Default
      const entry = new TabEntry(this.id);

      // Assert
      this.assertTrue(entry.panel instanceof Widget, 'default widget');
      this.assertEqual(
        entry.panel.name, 'StringAdapter panel content', 'default name'
      );

      // Act II - Custom
      entry.set(contentWrapper('custom content', 'new panel content'));

      // Assert
      this.assertEqual(
        entry.panel.name, 'StringAdapter custom content', 'custom content'
      );

      // Act III - Back to default
      entry.set();

      // Assert
      this.assertEqual(
        entry.panel.name, 'StringAdapter panel content', 'default again'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(TabEntryTestCase);

  /**
   * Implements the Tabs pattern.
   *
   * Tabs widgets will need `aria-*` attributes, TBD.
   */
  class Tabs extends Widget {

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'tabs');
      this.on('build', this.#onBuild)
        .on('destroy', this.#onDestroy);
    }

    #tablist

    #resetContainer = () => {
      this.container.innerHTML = '';
      this.#tablist = document.createElement('tablist');
      this.#tablist.role = 'tablist';
      this.container.append(this.#tablist);
    }

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      this.#resetContainer();

      this.logger.leaving(me);
    }

    #onDestroy = (...rest) => {
      const me = 'onDestroy';
      this.logger.entered(me, rest);

      this.logger.leaving(me);
    }

  }

  /* eslint-disable require-jsdoc */
  class TabsTestCase extends NH.xunit.TestCase {

    testDefaults() {
      // Assemble
      const w = new Tabs(this.id);

      // Assert
      this.assertEqual(w.container.tagName, 'TABS', 'correct element');
    }

    testEmptyBuild() {
      // Assemble
      const w = new Tabs(this.id);

      // Act
      w.build();

      // Assert
      const expected = [
        `^<tabs id="Tabs-[^-]*-${GUID}[^"]*">`,
        '<tablist role="tablist">',
        '</tablist>',
        '</tabs>$',
      ].join('');
      this.assertRegExp(w.container.outerHTML, RegExp(expected, 'u'));
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(TabsTestCase);

  /**
   * Implements the Modal pattern.
   *
   * Modal widgets should have exactly one of the `aria-labelledby` or
   * `aria-label` attributes.
   *
   * Modal widgets can use `aria-describedby` to reference an element that
   * describes the purpose if not clear from the initial content.
   */
  class Modal extends Widget {

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'dialog');
      this.on('build', this.#onBuild)
        .on('destroy', this.#onDestroy)
        .on('verify', this.#onVerify)
        .on('show', this.#onShow)
        .on('hide', this.#onHide)
        .set('')
        .hide();
    }

    /** @type {Widget} */
    get content() {
      return this.#content;
    }

    /**
     * Sets the content of this instance.
     * @param {Content} content - Content to use.
     * @returns {Widget} - This instance, for chaining.
     */
    set(content) {
      this.#content?.destroy();
      this.#content = contentWrapper('modal content', content);
      return this;
    }

    #content

    #onBuild = (...rest) => {
      const me = 'onBuild';
      this.logger.entered(me, rest);

      this.#content.build();
      this.container.replaceChildren(this.#content.container);

      this.logger.leaving(me);
    }

    #onDestroy = (...rest) => {
      const me = 'onDestroy';
      this.logger.entered(me, rest);

      this.#content.destroy();
      this.#content = null;

      this.logger.leaving(me);
    }

    #onVerify = (...rest) => {
      const me = 'onVerify';
      this.logger.entered(me, rest);

      const labelledBy = this.container.getAttribute('aria-labelledby');
      const label = this.container.getAttribute('aria-label');

      if (!labelledBy && !label) {
        throw new VerificationError(
          `Modal "${this.name}" should have one of "aria-labelledby" ` +
            'or "aria-label" attributes'
        );
      }

      if (labelledBy && label) {
        throw new VerificationError(
          `Modal "${this.name}" should not have both ` +
            `"aria-labelledby=${labelledBy}" and "aria-label=${label}"`
        );
      }

      this.logger.leaving(me);
    }

    #onShow = (...rest) => {
      const me = 'onShow';
      this.logger.entered(me, rest);

      this.container.showModal();
      this.#content.show();

      this.logger.leaving(me);
    }

    #onHide = (...rest) => {
      const me = 'onHide';
      this.logger.entered(me, rest);

      this.#content.hide();
      this.container.close();

      this.logger.leaving(me);
    }

  }

  /* eslint-disable require-jsdoc */
  class ModalTestCase extends NH.xunit.TestCase {

    testDefaults() {
      // Assemble
      const w = new Modal(this.id);

      // Assert
      this.assertEqual(w.container.tagName, 'DIALOG', 'correct element');
      this.assertFalse(w.visible, 'visibility');
      this.assertTrue(w.content instanceof Widget, 'is widget');
      this.assertRegExp(w.content.name, / modal content/u, 'content name');
    }

    testSetDestroysPrevious() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const w = new Modal(this.id);
      const content = w.content.on('destroy', cb);

      // Act
      w.set('new stuff');

      // Assert
      this.assertEqual(calls, [['destroy', content]]);
    }

    testCallsNestedWidget() {
      // Assemble
      const calls = [];
      const cb = (...rest) => {
        calls.push(rest);
      };
      const w = new Modal(this.id)
        .attrText('aria-label', 'test widget');
      const nest = contentWrapper(this.id, 'test content');

      nest.on('build', cb)
        .on('destroy', cb)
        .on('show', cb)
        .on('hide', cb);

      // Act
      w.set(nest)
        .build()
        .hide()
        .destroy();

      // Assert
      this.assertEqual(calls, [
        ['build', nest],
        ['hide', nest],
        ['destroy', nest],
      ]);
    }

    testVerify() {
      // Assemble
      const w = new Modal(this.id);

      // Assert
      this.assertRaisesRegExp(
        VerificationError,
        /should have one of/u,
        () => {
          w.build();
        },
        'no aria attributes'
      );

      // Add labelledby
      w.attrText('aria-labelledby', 'some-element');
      this.assertNoRaises(() => {
        w.build();
      }, 'post add aria-labelledby');

      // Add label
      w.attrText('aria-label', 'test modal');
      this.assertRaisesRegExp(
        VerificationError,
        /should not have both "[^"]*" and "[^"]*"/u,
        () => {
          w.build();
        },
        'both aria attributes'
      );

      // Remove labelledby
      w.attrText('aria-labelledby', null);
      this.assertNoRaises(() => {
        w.build();
      }, 'post remove aria-labelledby');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ModalTestCase);

  /**
   * A widget that can be opened and closed on demand, designed for fairly
   * persistent information.
   *
   * The element will get `open` and `close` events.
   */
  class Info extends Widget {

    /** @param {string} name - Name for this instance. */
    constructor(name) {
      super(name, 'dialog');
      this.logger.log(`${this.name} constructed`);
    }

    /** Open the widget. */
    open() {
      this.container.showModal();
      this.container.dispatchEvent(new Event('open'));
    }

    /** Close the widget. */
    close() {
      // HTMLDialogElement sends a close event natively.
      this.container.close();
    }

  }

  return {
    version: version,
    Widget: Widget,
    Layout: Layout,
    GridColumn: GridColumn,
    Grid: Grid,
    Modal: Modal,
    Info: Info,
  };

}());
