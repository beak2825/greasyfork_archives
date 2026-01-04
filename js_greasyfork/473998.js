// ==UserScript==
// @name        Itsnotlupus' React Tools
// @description Observe, inspect and perhaps modify a React tree through the React DevTools Hook
// @namespace   Itsnotlupus Industries
// @author      itsnotlupus
// @license     MIT
// @version     1.1
// ==/UserScript==

// React shenanigans. the code below allows us to:
// - observe every react renders
// - inspect nodes for props (which can expose redux and other useful state)
// - modify props value (which may not stick unless reapplied on every render)
class ReactTools {

  #HOOK = '__REACT_DEVTOOLS_GLOBAL_HOOK__';

  #reactRoots = new Set;
  #reactObservers = new Set;
  #notifyReactObservers(root) { this.#reactObservers.forEach(fn=>fn(root)); }

  // singleton, so we only muck with the React hook once.
  static #instance;
  constructor() {
    if (ReactTools.#instance) return ReactTools.#instance;
    ReactTools.#instance = this;
    
    const win = globalThis.unsafeWindow ?? window;
    const nop = ()=>{};
    const hook = win[this.#HOOK];
    if (hook) {
      const ocfr = hook.onCommitFiberRoot?.bind(hook) ?? nop;
      hook.onCommitFiberRoot = (_, root) => {
        this.#reactRoots.add(root);
        this.#notifyReactObservers(root);
        return ocfr(_, root);
      };
    } else {
      win[this.#HOOK] = {
        onCommitFiberRoot: (_, root) => {
          this.#reactRoots.add(root);
          this.#notifyReactObservers(root);
        },
        onCommitFiberUnmount: nop,
        inject: nop,
        checkDCE: nop,
        supportsFiber: true,
        on: nop,
        sub: nop,
        renderers: [],
        emit: nop
      };
    }
  }

  /** Traversal of React's tree to find nodes that match a props name */
  findNodesWithProp(name, firstOnly = false) {
    const acc = new Set;
    const visited = new Set;
    const getPropFromNode = node => {
      if (!node || visited.has(node)) return;
      visited.add(node);
      const props = node.memoizedProps;
      if (props && typeof props === 'object' && name in props) {
        acc.add(node);
        if (firstOnly) throw 0; // goto end
      }
      getPropFromNode(node.sibling);
      getPropFromNode(node.child);
    };
    try { this.#reactRoots.forEach(root => getPropFromNode(root.current)) } catch {}
    return Array.from(acc);
  }

  /** Magically obtain a prop value from the most top-level React component we can find */
  getProp(name) {
    return this.findNodesWithProp(name, true)[0]?.memoizedProps?.[name];
  }

  /** Forcefully mutate props on a component node in the react tree. */
  updateNodeProps(node, props) {
    Object.assign(node.memoizedProps, props);
    Object.assign(node.pendingProps, props);
    Object.assign(node.stateNode?.props??{}, props);
  }

  /** calls a function whenever react renders */
  observe(fn) {
    this.#reactObservers.add(fn);
    return () => this.#reactObservers.delete(fn);
  };
  
  // Hook into a React tree, and find a redux-shaped store off of one of the components there.
  static withReduxState(fn) {
    const react = new ReactTools();
    const disconnect = react.observe(() => {
      const store = react.getProp('store');
      if (store) {
        fn(store.getState());
        disconnect();
      }
    });
  }
}